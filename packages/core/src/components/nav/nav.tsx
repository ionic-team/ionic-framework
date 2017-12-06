import { Component, Element, Event, EventEmitter, Listen, Method, Prop } from '@stencil/core';
import {
  ComponentDataPair,
  Config,
  FrameworkDelegate,
  NavController,
  NavOptions,
  NavState,
  PublicNav,
  PublicViewController,
  RouterEntries,
  ViewController
} from '../../index';
import {
  getActiveImpl,
  getFirstView,
  getNextNavId,
  getPreviousImpl,
  getViews,
  resolveRoute
} from '../../navigation/nav-utils';
import { assert, isReady } from '../../utils/helpers';

/* it is very important to keep this class in sync with ./nav-interface interface */
@Component({
  tag: 'ion-nav',
})
export class Nav implements PublicNav {

  @Element() element: HTMLElement;
  @Event() navInit: EventEmitter;
  @Event() ionNavChanged: EventEmitter;

  useRouter: boolean;
  navId: number;
  init = false;
  routes: RouterEntries = [];
  parent: Nav;
  views: ViewController[] = [];
  transitioning?: boolean;
  destroyed?: boolean;
  transitionId?: number;
  isViewInitialized?: boolean;
  isPortal: boolean;
  swipeToGoBackTransition: any; // TODO Transition
  childNavs?: Nav[];
  navController?: NavController;

  @Prop() mode: string;
  @Prop() root: any;
  @Prop() delegate: FrameworkDelegate;
  @Prop({ context: 'config' }) config: Config;

  constructor() {
    this.navId = getNextNavId();
  }

  componentWillLoad() {
    this.routes = Array.from(this.element.querySelectorAll('ion-route'))
      .map(child => child.getRoute());
    this.useRouter = this.config.getBoolean('useRouter', false);
  }

  componentDidLoad() {
    if (this.init) {
      return;
    }
    this.init = true;
    if (!this.useRouter) {
      componentDidLoadImpl(this);
    }
  }

  getViews(): PublicViewController[] {
    return getViews(this);
  }

  @Method()
  push(component: any, data?: any, opts?: NavOptions): Promise<any> {
    return pushImpl(this, component, data, opts);
  }

  @Method()
  pop(opts?: NavOptions): Promise<any> {
    return popImpl(this, opts);
  }

  @Method()
  setRoot(component: any, data?: any, opts?: NavOptions): Promise<any> {
    return setRootImpl(this, component, data, opts);
  }

  @Method()
  insert(insertIndex: number, page: any, params?: any, opts?: NavOptions): Promise<any> {
    return insertImpl(this, insertIndex, page, params, opts);
  }

  @Method()
  insertPages(insertIndex: number, insertPages: any[], opts?: NavOptions): Promise<any> {
    return insertPagesImpl(this, insertIndex, insertPages, opts);
  }

  @Method()
  popToRoot(opts?: NavOptions): Promise<any> {
    return popToRootImpl(this, opts);
  }

  @Method()
  popTo(indexOrViewCtrl: any, opts?: NavOptions): Promise<any> {
    return popToImpl(this, indexOrViewCtrl, opts);
  }

  @Method()
  removeIndex(startIndex: number, removeCount?: number, opts?: NavOptions): Promise<any> {
    return removeImpl(this, startIndex, removeCount, opts);
  }

  @Method()
  removeView(viewController: PublicViewController, opts?: NavOptions): Promise<any> {
    return removeViewImpl(this, viewController, opts);
  }

  @Method()
  setPages(componentDataPairs: ComponentDataPair[], opts?: NavOptions): Promise<any> {
    return setPagesImpl(this, componentDataPairs, opts);
  }

  @Method()
  getActive(): PublicViewController {
    return getActiveImpl(this);
  }

  @Method()
  getPrevious(view?: PublicViewController): PublicViewController {
    return getPreviousImpl(this, view as ViewController);
  }

  @Method()
  canGoBack(): boolean {
    return canGoBackImpl(this);
  }

  @Method()
  canSwipeBack(): boolean {
    return true; // TODO, implement this for real
  }

  @Method()
  getFirstView(): PublicViewController {
    return getFirstView(this);
  }

  @Method()
  resize() {
    console.log('resize content');
  }

  @Listen('navInit')
  navInitialized(event: CustomEvent) {
    navInitializedImpl(this, event);
  }

  @Method()
  getState(): NavState {
    assert(this.useRouter, 'routing is disabled');
    return getState(this);
  }

  @Method()
  setRouteId(id: string, _: any = {}): Promise<void> {
    assert(this.useRouter, 'routing is disabled');
    const active = this.getActive();
    if (active && active.component === id) {
      return Promise.resolve();
    }
    return this.setRoot(id);
  }

  @Method()
  getRoutes(): RouterEntries {
    assert(this.useRouter, 'routing is disabled');
    return this.routes;
  }

  render() {
    return <slot></slot>;
  }
}

export function getState(nav: Nav): NavState {
  const active = getActiveImpl(nav);
  if (!active) {
    return null;
  }
  const component = active.component;
  const route = resolveRoute(nav, component);
  if (!route) {
    console.error('cant reverse route by component', component);
    return null;
  }

  return {
    path: route.path,
    focusNode: active.element
  };
}

export function componentDidLoadImpl(nav: Nav) {
  nav.navInit.emit(nav);
  if (nav.root) {
    nav.setRoot(nav.root);
  }
}

export function pushImpl(nav: Nav, component: any, data: any, opts: NavOptions) {
  return getNavController(nav).then(() => {
    return nav.navController.push(nav, component, data, opts);
  });
}

export function popImpl(nav: Nav, opts: NavOptions) {
  return getNavController(nav).then(() => {
    return nav.navController.pop(nav, opts);
  });
}

export function setRootImpl(nav: Nav, component: any, data: any, opts: NavOptions) {
  return getNavController(nav).then(() => {
    return nav.navController.setRoot(nav, component, data, opts);
  });
}

export function insertImpl(nav: Nav, insertIndex: number, page: any, params: any, opts: NavOptions) {
  return getNavController(nav).then(() => {
    return nav.navController.insert(nav, insertIndex, page, params, opts);
  });
}

export function insertPagesImpl(nav: Nav, insertIndex: number, insertPages: any[], opts: NavOptions) {
  return getNavController(nav).then(() => {
    return nav.navController.insertPages(nav, insertIndex, insertPages, opts);
  });
}

export function popToRootImpl(nav: Nav, opts: NavOptions) {
  return getNavController(nav).then(() => {
    return nav.navController.popToRoot(nav, opts);
  });
}

export function popToImpl(nav: Nav, indexOrViewCtrl: any, opts: NavOptions) {
  return getNavController(nav).then(() => {
    return nav.navController.popTo(nav, indexOrViewCtrl, opts);
  });
}

export function removeImpl(nav: Nav, startIndex: number, removeCount: number, opts: NavOptions) {
  return getNavController(nav).then(() => {
    return nav.navController.removeIndex(nav, startIndex, removeCount, opts);
  });
}

export function removeViewImpl(nav: Nav, viewController: PublicViewController, opts?: NavOptions) {
  return getNavController(nav).then(() => {
    return nav.navController.removeView(nav, viewController as ViewController, opts);
  });
}

export function setPagesImpl(nav: Nav, componentDataPairs: ComponentDataPair[], opts?: NavOptions) {
  return getNavController(nav).then(() => {
    return nav.navController.setPages(nav, componentDataPairs, opts);
  });
}

export function getNavController(nav: Nav): Promise<any> {
  if (nav.navController) {
    return Promise.resolve();
  }
  nav.navController = document.querySelector('ion-nav-controller') as any as NavController;
  return isReady(nav.navController as any as HTMLElement);
}

export function canGoBackImpl(nav: Nav) {
  return nav.views && nav.views.length > 0;
}

export function navInitializedImpl(potentialParent: Nav, event: CustomEvent) {
  if (potentialParent.element !== event.target) {
    // set the parent on the child nav that dispatched the event
    (event.detail as Nav).parent = potentialParent;
    if (!potentialParent.childNavs) {
      potentialParent.childNavs = [];
    }
    potentialParent.childNavs.push((event.detail as Nav));
    // kill the event so it doesn't propagate further
    event.stopPropagation();
  }
}

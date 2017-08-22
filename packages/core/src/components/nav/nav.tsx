import { Component, Element, Method, Prop } from '@stencil/core';
import { AnimationController, Config } from '../..';
import { ComponentDataPair, FrameworkDelegate, Nav, NavController, NavOptions, ViewController } from '../../navigation/nav-interfaces';

import { getActiveImpl, getFirstView, getPreviousImpl, getViews, init } from '../../navigation/nav-utils';

@Component({
  tag: 'ion-nav',
})
export class IonNav implements Nav {

  @Element() element: HTMLElement;
  id: number;
  views: ViewController[];
  transitioning?: boolean;
  destroyed?: boolean;
  transitionId?: number;
  isViewInitialized?: boolean;
  isPortal: boolean;
  swipeToGoBackTransition: any; // TODO Transition
  childNavs?: Nav[];

  @Prop() root: any;
  @Prop() delegate: FrameworkDelegate;
  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: AnimationController;
  @Prop({ connect: 'ion-nav-controller' }) navController: NavController;
  @Prop({ context: 'config' }) config: Config;

  constructor() {
    init(this);
  }

  ionViewDidLoad() {
    this.setRoot(this.root);
  }

  getViews(): ViewController[] {
    return getViews(this);
  }

  getParent(): Nav {
    return null; // TODO
  }

  @Method()
  push(component: any, data?: any, opts?: NavOptions) {
    return pushImpl(this, component, data, opts);
  }

  @Method()
  pop(opts?: NavOptions) {
    return popImpl(this, opts);
  }

  @Method()
  setRoot(component: any, data?: any, opts?: NavOptions) {
    return setRootImpl(this, component, data, opts);
  }

  @Method()
  insert(insertIndex: number, page: any, params?: any, opts?: NavOptions) {
    return insertImpl(this, insertIndex, page, params, opts);
  }

  @Method()
  insertPages(insertIndex: number, insertPages: any[], opts?: NavOptions) {
    return insertPagesImpl(this, insertIndex, insertPages, opts);
  }

  @Method()
  popToRoot(opts?: NavOptions) {
    return popToRootImpl(this, opts);
  }

  @Method()
  popTo(indexOrViewCtrl: any, opts?: NavOptions) {
    return popToImpl(this, indexOrViewCtrl, opts);
  }

  @Method()
  remove(startIndex: number, removeCount?: number, opts?: NavOptions) {
    return removeImpl(this, startIndex, removeCount, opts);
  }

  @Method()
  removeView(viewController: ViewController, opts?: NavOptions) {
    return removeViewImpl(this, viewController, opts);
  }

  @Method()
  setPages(componentDataPairs: ComponentDataPair[], opts? : NavOptions) {
    return setPagesImpl(this, componentDataPairs, opts);
  }

  @Method()
  getActive(): ViewController {
    return getActiveImpl(this);
  }

  @Method()
  getPrevious(view?: ViewController): ViewController {
    return getPreviousImpl(this, view);
  }

  @Method()
  canGoBack(nav: Nav) {
    return nav.views && nav.views.length > 0;
  }

  @Method()
  canSwipeBack() {
    return true; // TODO, implement this for real
  }

  @Method()
  getFirstView() {
    return getFirstView(this);
  }

  render() {
    return <slot></slot>;
  }
}

export function pushImpl(nav: Nav, component: any, data: any, opts: NavOptions) {
  return nav.navController.push(nav, component, data, opts);
}

export function popImpl(nav: Nav, opts: NavOptions) {
  return nav.navController.pop(nav, opts);
}

export function setRootImpl(nav: Nav, component: any, data: any, opts: NavOptions) {
  return nav.navController.setRoot(nav, component, data, opts);
}

export function insertImpl(nav: Nav, insertIndex: number, page: any, params: any, opts: NavOptions) {
  return nav.navController.insert(nav, insertIndex, page, params, opts);
}

export function insertPagesImpl(nav: Nav, insertIndex: number, insertPages: any[], opts: NavOptions) {
  return nav.navController.insertPages(nav, insertIndex, insertPages, opts);
}

export function popToRootImpl(nav: Nav, opts: NavOptions) {
  return nav.navController.popToRoot(nav, opts);
}

export function popToImpl(nav: Nav, indexOrViewCtrl: any, opts: NavOptions) {
  return nav.navController.popTo(nav, indexOrViewCtrl, opts);
}

export function removeImpl(nav: Nav, startIndex: number, removeCount: number, opts: NavOptions) {
  return nav.navController.remove(nav, startIndex, removeCount, opts);
}

export function removeViewImpl(nav: Nav, viewController: ViewController, opts?: NavOptions) {
  return nav.navController.removeView(nav, viewController, opts);
}

export function setPagesImpl(nav: Nav, componentDataPairs: ComponentDataPair[], opts? : NavOptions) {
  return nav.navController.setPages(nav, componentDataPairs, opts);
}
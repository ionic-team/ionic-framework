import { Component, Element, Method, Prop } from '@stencil/core';
import { AnimationController, Config } from '../..';
import { FrameworkDelegate, Nav as INav, NavOptions, ViewController } from '../../navigation/nav-interfaces';
import { getNextNavId, getViews, pop, push, setRoot } from '../../navigation/nav-controller-functions';

import { delegate as defaultStencilDelegate } from '../../navigation/stencil-framework-delegate';

@Component({
  tag: 'ion-nav',
})
export class Nav implements INav {

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
  push(component: any, data?: any, opts: NavOptions = {}) {
    return push(this, this.delegate || defaultStencilDelegate, component, data, opts);
  }

  @Method()
  pop(opts: NavOptions = {}) {
    return pop(this, this.delegate || defaultStencilDelegate, opts);
  }

  setRoot(component: any, data?: any, opts: NavOptions = {}) {
    return setRoot(this, this.delegate || defaultStencilDelegate, component, data, opts);
  }

  render() {
    return <slot></slot>;
  }

  getActive() {
    return getActiveImpl(this);
  }

  getPrevious(view?: ViewController) {
    return getPreviousImpl(this, view);
  }
}

export function init(nav: Nav) {
  nav.id = getNextNavId();
  nav.views = [];
}

export function getActiveImpl(nav: Nav): ViewController {
  return nav.views && nav.views.length > 0 ? nav.views[nav.views.length - 1] : null;
}

export function getPreviousImpl(nav: Nav, viewController: ViewController): ViewController {
  if (!viewController) {
    viewController = nav.getActive();
  }
  return nav.views[nav.views.indexOf(viewController) - 1];
}
import { Component, Element, Method, Prop } from '@stencil/core';
import { FrameworkDelegate, NavController, NavOptions, ViewController } from '../../navigation/nav-interfaces';
import { getNextNavId, getViews, pop, push, setRoot } from '../../navigation/nav-controller-functions';

import { delegate as defaultStencilDelegate } from '../../navigation/stencil-framework-delegate';

@Component({
  tag: 'ion-nav',
})
export class Nav implements NavController {

  @Element() element: HTMLElement;
  id: number;
  views: ViewController[];
  transitioning?: boolean;
  destroyed?: boolean;
  transitionId?: number;
  isViewInitialized?: boolean;
  isPortal: boolean;
  swipeToGoBackTransition: any; // TODO Transition
  childNavs?: NavController[];

  @Prop() root: any;
  @Prop() delegate: FrameworkDelegate;

  constructor() {
    init(this);
  }

  ionViewDidLoad() {
    this.setRoot(this.root);
  }

  getViews(): ViewController[] {
    return getViews(this);
  }

  getParent(): NavController {
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
}

export function init(nav: NavController) {
  nav.id = getNextNavId();
  nav.views = [];
}
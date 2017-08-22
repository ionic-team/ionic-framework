import { Component, Element, Method, Prop } from '@stencil/core';
import { AnimationController, Config } from '../..';
import { FrameworkDelegate, Nav, NavController, NavOptions, ViewController } from '../../navigation/nav-interfaces';

import { getNextNavId, pop, push, setRoot } from '../../navigation/nav-controller-functions';

import { delegate as defaultStencilDelegate } from '../../navigation/stencil-framework-delegate';

@Component({
  tag: 'ion-nav-controller',
})
export class NavControllerImpl implements NavController {

  @Element() element: HTMLElement;

  @Prop() delegate: FrameworkDelegate;
  @Prop({ connect: 'ion-animation-controller' }) animationCtrl: AnimationController;
  @Prop({ context: 'config' }) config: Config;

  constructor() {
  }


  @Method()
  push(nav: Nav, component: any, data?: any, opts: NavOptions = {}) {
    return push(nav, this.delegate || defaultStencilDelegate, component, data, opts);
  }

  @Method()
  pop(nav: Nav, opts: NavOptions = {}) {
    return pop(nav, this.delegate || defaultStencilDelegate, opts);
  }

  @Method()
  setRoot(nav: Nav, component: any, data?: any, opts: NavOptions = {}) {
    return setRoot(nav, this.delegate || defaultStencilDelegate, component, data, opts);
  }

  render() {
    return <slot></slot>;
  }
}


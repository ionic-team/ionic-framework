import { Component, Element, Method, Prop } from '@stencil/core';
import { transition } from '../../utils';
import { NavDirection } from '../nav/nav-util';
import { AnimationBuilder, Config, FrameworkDelegate, NavOutlet } from '../..';
import { attachComponent, detachComponent } from '../../utils/framework-delegate';
import { RouteID, RouteWrite } from '../router/utils/interfaces';

import iosTransitionAnimation from '../nav/animations/ios.transition';
import mdTransitionAnimation from '../nav/animations/md.transition';

@Component({
  tag: 'ion-router-outlet'
})
export class RouterOutlet implements NavOutlet {

  private isTransitioning = false;
  private activeEl: HTMLElement = undefined;
  private activeComponent: any;

  mode: string;

  @Element() el: HTMLElement;

  @Prop({context: 'config'}) config: Config;
  @Prop({connect: 'ion-animation-controller'}) animationCtrl: HTMLIonAnimationControllerElement;

  @Prop() animated = true;
  @Prop() animationBuilder: AnimationBuilder;
  @Prop() delegate: FrameworkDelegate;

  componentDidUnload() {
    this.activeEl = this.activeComponent = undefined;
  }

  @Method()
  async setRoot(component: HTMLElement|string, params?: {[key: string]: any}, opts?: RouterOutletOptions): Promise<boolean> {
    if (this.isTransitioning || this.activeComponent === component) {
      return false;
    }
    this.activeComponent = component;

    // attach entering view to DOM
    const enteringEl = await attachComponent(this.delegate, this.el, component, ['ion-page', 'hide-page'], params);
    const leavingEl = this.activeEl;

    // commit animation
    await this.commit(enteringEl, opts);

    // remove leaving view
    detachComponent(this.delegate, leavingEl);

    return true;
  }

  @Method()
  async commit(enteringEl: HTMLElement, opts?: RouterOutletOptions): Promise<boolean> {
    // isTransitioning acts as a lock to prevent reentering
    if (this.isTransitioning || this.activeEl === enteringEl) {
      return false;
    }
    this.isTransitioning = true;

    opts = opts || {};

    await transition({
      animationBuilder: this.getAnimationBuilder(opts),
      direction: opts.direction,
      duration: opts.duration,
      easing: opts.easing,

      animationCtrl: this.animationCtrl,
      enteringEl: enteringEl,
      leavingEl: this.activeEl,
      baseEl: this.el,
    });
    this.activeEl = enteringEl;
    this.isTransitioning = false;
    return true;
  }

  @Method()
  async setRouteId(id: string, data: any, direction: number): Promise<RouteWrite> {
    const changed = await this.setRoot(id, data, {
      duration: direction === 0 ? 0 : undefined,
      direction: direction === -1 ? NavDirection.Back : NavDirection.Forward,
    });
    return {
      changed,
      element: this.activeEl
    };
  }

  @Method()
  getRouteId(): RouteID|undefined {
    const active = this.activeEl;
    return active ? {
      id: active.tagName,
      element: active,
    } : undefined;
  }

  private getAnimationBuilder(opts: RouterOutletOptions) {
    if (opts.duration === 0 || this.animated === false || this.activeEl === undefined) {
      return undefined;
    }
    const mode = opts.mode || this.config.get('pageTransition', this.mode);
    return opts.animationBuilder
      || this.animationBuilder
      || mode === 'ios' ? iosTransitionAnimation : mdTransitionAnimation;
  }

  render() {
    return [
      this.mode === 'ios' && <div class='nav-decor'/>,
      <slot/>
    ];
  }
}

export interface RouterOutletOptions {
  animationBuilder?: AnimationBuilder;
  duration?: number;
  easing?: string;
  direction?: NavDirection;
  mode?: 'md' | 'ios';
}

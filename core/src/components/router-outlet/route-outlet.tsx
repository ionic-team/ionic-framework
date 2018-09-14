import { Component, ComponentInterface, Element, Event, EventEmitter, Method, Prop, QueueApi } from '@stencil/core';

import { AnimationBuilder, ComponentProps, ComponentRef, Config, FrameworkDelegate, Mode, NavOutlet, RouteID, RouteWrite, RouterOutletOptions } from '../../interface';
import { transition } from '../../utils';
import { attachComponent, detachComponent } from '../../utils/framework-delegate';

@Component({
  tag: 'ion-router-outlet',
  styleUrl: 'route-outlet.scss',
  shadow: true
})
export class RouterOutlet implements ComponentInterface, NavOutlet {

  private activeEl: HTMLElement | undefined;
  private activeComponent: any;
  private waitPromise?: Promise<void>;

  mode!: Mode;

  @Element() el!: HTMLElement;

  @Prop({ context: 'config' }) config!: Config;
  @Prop({ connect: 'ion-animation-controller' }) animationCtrl!: HTMLIonAnimationControllerElement;
  @Prop({ context: 'window' }) win!: Window;
  @Prop({ context: 'queue' }) queue!: QueueApi;

  @Prop() animated = true;
  @Prop() animationBuilder?: AnimationBuilder;
  @Prop() delegate?: FrameworkDelegate;

  @Event() ionNavWillLoad!: EventEmitter<void>;
  @Event() ionNavWillChange!: EventEmitter<void>;
  @Event() ionNavDidChange!: EventEmitter<void>;

  componentWillLoad() {
    this.ionNavWillLoad.emit();
  }

  componentDidUnload() {
    this.activeEl = this.activeComponent = undefined;
  }

  /**
   * Set the root component for the given navigation stack
   */
  @Method()
  async setRoot(component: ComponentRef, params?: ComponentProps, opts?: RouterOutletOptions): Promise<boolean> {
    if (this.activeComponent === component) {
      return false;
    }

    // attach entering view to DOM
    const leavingEl = this.activeEl;
    const enteringEl = await attachComponent(this.delegate, this.el, component, ['ion-page', 'ion-page-invisible'], params);

    this.activeComponent = component;
    this.activeEl = enteringEl;

    // commit animation
    await this.commit(enteringEl, leavingEl, opts);
    await detachComponent(this.delegate, leavingEl);

    return true;
  }

  /** @hidden */
  @Method()
  async commit(enteringEl: HTMLElement, leavingEl: HTMLElement | undefined, opts?: RouterOutletOptions): Promise<boolean> {
    const unlock = await this.lock();
    let changed = false;
    try {
      changed = await this.transition(enteringEl, leavingEl, opts);
    } catch (e) {
      console.error(e);
    }
    unlock();
    return changed;
  }

  /** @hidden */
  @Method()
  async setRouteId(id: string, params: ComponentProps | undefined, direction: number): Promise<RouteWrite> {
    const changed = await this.setRoot(id, params, {
      duration: direction === 0 ? 0 : undefined,
      direction: direction === -1 ? 'back' : 'forward',
    });
    return {
      changed,
      element: this.activeEl
    };
  }

  /** Returns the ID for the current route */
  @Method()
  async getRouteId(): Promise<RouteID | undefined> {
    const active = this.activeEl;
    return active ? {
      id: active.tagName,
      element: active,
    } : undefined;
  }

  private async lock() {
    const p = this.waitPromise;
    let resolve!: () => void;
    this.waitPromise = new Promise(r => resolve = r);

    if (p !== undefined) {
      await p;
    }
    return resolve;
  }

  async transition(enteringEl: HTMLElement, leavingEl: HTMLElement | undefined, opts?: RouterOutletOptions): Promise<boolean> {
    // isTransitioning acts as a lock to prevent reentering
    if (leavingEl === enteringEl) {
      return false;
    }

    // emit nav will change event
    this.ionNavWillChange.emit();

    opts = opts || {};

    const { mode, queue, animationCtrl, win, el } = this;
    const animated = this.animated && this.config.getBoolean('animated', true);
    await transition({
      mode,
      queue,
      animated,
      animationCtrl,
      window: win,
      enteringEl,
      leavingEl,
      baseEl: el,

      ...opts
    });

    // emit nav changed event
    this.ionNavDidChange.emit();

    return true;
  }

  render() {
    return [
      this.mode === 'ios' && <div class="nav-decor"/>,
      <slot></slot>
    ];
  }
}

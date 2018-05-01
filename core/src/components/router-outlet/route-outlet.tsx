import { Component, Element, Event, EventEmitter, Method, Prop } from '@stencil/core';
import { AnimationBuilder, ComponentProps, ComponentRef, Config, FrameworkDelegate, Mode, NavOutlet, RouteID, RouteWrite, RouterOutletOptions } from '../../interface';
import { transition } from '../../utils';
import { attachComponent, detachComponent } from '../../utils/framework-delegate';


@Component({
  tag: 'ion-router-outlet'
})
export class RouterOutlet implements NavOutlet {

  private isTransitioning = false;
  private activeEl: HTMLElement|undefined;
  private activeComponent: any;

  mode!: Mode;

  @Element() el!: HTMLElement;

  @Prop({ context: 'config' }) config!: Config;
  @Prop({ connect: 'ion-animation-controller' }) animationCtrl!: HTMLIonAnimationControllerElement;
  @Prop({ context: 'window' }) win!: Window;

  @Prop({ mutable: true }) animated?: boolean;
  @Prop() animationBuilder?: AnimationBuilder;
  @Prop() delegate?: FrameworkDelegate;

  @Event() ionNavWillLoad!: EventEmitter<void>;
  @Event() ionNavWillChange!: EventEmitter<void>;
  @Event() ionNavDidChange!: EventEmitter<void>;

  componentWillLoad() {
    if (this.animated === undefined) {
      this.animated = this.config.getBoolean('animate', true);
    }

    this.ionNavWillLoad.emit();
  }

  componentDidUnload() {
    this.activeEl = this.activeComponent = undefined;
  }

  @Method()
  async setRoot(component: ComponentRef, params?: ComponentProps, opts?: RouterOutletOptions): Promise<boolean> {
    if (this.isTransitioning || this.activeComponent === component) {
      return false;
    }
    this.activeComponent = component;

    // attach entering view to DOM
    const enteringEl = await attachComponent(this.delegate, this.el, component, ['ion-page', 'hide-page'], params);
    const leavingEl = this.activeEl;

    // commit animation
    await this.commit(enteringEl, leavingEl, opts);

    // remove leaving view
    this.activeEl = enteringEl;
    detachComponent(this.delegate, leavingEl);

    return true;
  }

  @Method()
  async commit(enteringEl: HTMLElement, leavingEl: HTMLElement|undefined, opts?: RouterOutletOptions): Promise<boolean> {
    // isTransitioning acts as a lock to prevent reentering
    if (this.isTransitioning || leavingEl === enteringEl) {
      return false;
    }
    this.isTransitioning = true;

    // emit nav will change event
    this.ionNavWillChange.emit();

    opts = opts || {};

    await transition({
      mode: this.mode,
      animated: this.animated,
      animationCtrl: this.animationCtrl,
      window: this.win,
      enteringEl: enteringEl,
      leavingEl: leavingEl,
      baseEl: this.el,

      ...opts
    });
    this.isTransitioning = false;

    // emit nav changed event
    this.ionNavDidChange.emit();
    return true;
  }

  @Method()
  async setRouteId(id: string, params: any, direction: number): Promise<RouteWrite> {
    const changed = await this.setRoot(id, params, {
      duration: direction === 0 ? 0 : undefined,
      direction: direction === -1 ? 'back' : 'forward',
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

  render() {
    return [
      this.mode === 'ios' && <div class="nav-decor"/>,
      <slot/>
    ];
  }
}

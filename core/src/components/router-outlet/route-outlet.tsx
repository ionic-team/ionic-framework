import { Component, ComponentInterface, Element, Event, EventEmitter, Method, Prop, Watch, h } from '@stencil/core';

import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { Animation, AnimationBuilder, ComponentProps, ComponentRef, FrameworkDelegate, Gesture, NavOutlet, RouteID, RouteWrite, RouterDirection, RouterOutletOptions, SwipeGestureHandler } from '../../interface';
import { attachComponent, detachComponent } from '../../utils/framework-delegate';
import { transition } from '../../utils/transition';

@Component({
  tag: 'ion-router-outlet',
  styleUrl: 'route-outlet.scss',
  shadow: true
})
export class RouterOutlet implements ComponentInterface, NavOutlet {

  private activeEl: HTMLElement | undefined;
  private activeComponent: any;
  private waitPromise?: Promise<void>;
  private gesture?: Gesture;
  private ani?: Animation;

  @Element() el!: HTMLElement;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop({ mutable: true }) mode = getIonMode(this);

  /** @internal */
  @Prop() delegate?: FrameworkDelegate;

  /**
   * If `true`, the router-outlet should animate the transition of components.
   */
  @Prop() animated = true;

  /**
   * By default `ion-nav` animates transition between pages based in the mode (ios or material design).
   * However, this property allows to create custom transition using `AnimateBuilder` functions.
   */
  @Prop() animation?: AnimationBuilder;

  /** @internal */
  @Prop() swipeHandler?: SwipeGestureHandler;
  @Watch('swipeHandler')
  swipeHandlerChanged() {
    if (this.gesture) {
      this.gesture.setDisabled(this.swipeHandler === undefined);
    }
  }

  /** @internal */
  @Event() ionNavWillLoad!: EventEmitter<void>;

  /** @internal */
  @Event({ bubbles: false }) ionNavWillChange!: EventEmitter<void>;

  /** @internal */
  @Event({ bubbles: false }) ionNavDidChange!: EventEmitter<void>;

  componentWillLoad() {
    this.ionNavWillLoad.emit();
  }

  async componentDidLoad() {
    this.gesture = (await import('../../utils/gesture/swipe-back')).createSwipeBackGesture(
      this.el,
      () => !!this.swipeHandler && this.swipeHandler.canStart(),
      () => this.swipeHandler && this.swipeHandler.onStart(),
      step => this.ani && this.ani.progressStep(step),
      (shouldComplete, step, dur) => {
        if (this.ani) {
          this.ani.progressEnd(shouldComplete, step, dur);
        }
        if (this.swipeHandler) {
          this.swipeHandler.onEnd(shouldComplete);
        }
      }
    );
    this.swipeHandlerChanged();
  }

  componentDidUnload() {
    this.activeEl = this.activeComponent = undefined;
    if (this.gesture) {
      this.gesture.destroy();
      this.gesture = undefined;
    }
  }

  /** @internal */
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

  /** @internal */
  @Method()
  async setRouteId(id: string, params: ComponentProps | undefined, direction: RouterDirection): Promise<RouteWrite> {
    const changed = await this.setRoot(id, params, {
      duration: direction === 'root' ? 0 : undefined,
      direction: direction === 'back' ? 'back' : 'forward',
    });
    return {
      changed,
      element: this.activeEl
    };
  }

  /** @internal */
  @Method()
  async getRouteId(): Promise<RouteID | undefined> {
    const active = this.activeEl;
    return active ? {
      id: active.tagName,
      element: active,
    } : undefined;
  }

  private async setRoot(component: ComponentRef, params?: ComponentProps, opts?: RouterOutletOptions): Promise<boolean> {
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

  private async transition(enteringEl: HTMLElement, leavingEl: HTMLElement | undefined, opts: RouterOutletOptions = {}): Promise<boolean> {
    if (leavingEl === enteringEl) {
      return false;
    }

    // emit nav will change event
    this.ionNavWillChange.emit();

    const { el, mode } = this;
    const animated = this.animated && config.getBoolean('animated', true);
    const animationBuilder = this.animation || opts.animationBuilder || config.get('navAnimation');

    await transition({
      mode,
      animated,
      animationBuilder,
      enteringEl,
      leavingEl,
      baseEl: el,
      progressCallback: (opts.progressAnimation
        ? ani => this.ani = ani
        : undefined
      ),
      ...opts
    });

    // emit nav changed event
    this.ionNavDidChange.emit();

    return true;
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

  render() {
    return (
      <slot></slot>
    );
  }
}

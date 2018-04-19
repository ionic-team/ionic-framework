import { Component, Element, EventListenerEnable, Listen, Prop } from '@stencil/core';
import { now, pointerCoord } from '../../utils/helpers';


@Component({
  tag: 'ion-tap-click',
})
export class TapClick {

  private lastTouch = -MOUSE_WAIT * 10;
  private lastActivated = 0;
  private cancelled = false;

  private activatableEle?: HTMLElement;
  private activeDefer: any;

  private clearDefers = new WeakMap<HTMLElement, any>();

  @Prop({ context: 'isServer'}) isServer!: boolean;
  @Prop({ context: 'enableListener'}) enableListener!: EventListenerEnable;

  @Element() el!: HTMLElement;

  @Listen('body:click', {passive: false, capture: true})
  onBodyClick(ev: Event) {
    if (this.cancelled) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  // Touch Events
  @Listen('document:touchstart', { passive: true, capture: true })
  onTouchStart(ev: TouchEvent) {
    this.lastTouch = now(ev);
    this.pointerDown(ev);
  }

  @Listen('document:touchcancel', { passive: false, capture: true })
  @Listen('document:touchend', { passive: false, capture: true })
  onTouchEnd(ev: TouchEvent) {
    this.lastTouch = now(ev);
    this.pointerUp(ev);
  }

  @Listen('document:mousedown', { passive: true, capture: true })
  onMouseDown(ev: MouseEvent) {
    const t = now(ev) - MOUSE_WAIT;
    if (this.lastTouch < t) {
      this.pointerDown(ev);
    }
  }

  @Listen('document:mouseup', { passive: false, capture: true })
  onMouseUp(ev: TouchEvent) {
    const t = now(ev) - MOUSE_WAIT;
    if (this.lastTouch < t) {
      this.pointerUp(ev);
    }
  }

  @Listen('body:ionScrollStart')
  @Listen('body:ionGestureCaptured')
  cancelActive() {
    clearTimeout(this.activeDefer);
    if (this.activatableEle) {
      this.removeActivated(false);
      this.activatableEle = undefined;
    }
    this.cancelled = true;
  }

  private pointerDown(ev: any) {
    if (this.activatableEle) {
      return;
    }
    this.cancelled = false;
    this.setActivatedElement(getActivatableTarget(ev.target), ev);
  }

  private pointerUp(ev: UIEvent) {
    this.setActivatedElement(undefined, ev);
    if (this.cancelled && ev.cancelable) {
      ev.preventDefault();
    }
  }

  private setActivatedElement(el: HTMLElement | undefined, ev: UIEvent) {
    // do nothing
    const activatableEle = this.activatableEle;
    if (el && el === activatableEle) {
      return;
    }
    clearTimeout(this.activeDefer);
    this.activeDefer = undefined;

    const {x, y} = pointerCoord(ev);

    // unactivate selected
    if (activatableEle) {
      if (this.clearDefers.has(activatableEle)) {
        throw new Error('internal error');
      }
      if (!activatableEle.classList.contains(ACTIVATED)) {
        this.addActivated(activatableEle, x, y);
      }
      this.removeActivated(true);
    }

    // activate
    if (el) {
      const deferId = this.clearDefers.get(el);
      if (deferId) {
        clearTimeout(deferId);
        this.clearDefers.delete(el);
      }

      el.classList.remove(ACTIVATED);
      this.activeDefer = setTimeout(() => {
        this.addActivated(el, x, y);
        this.activeDefer = undefined;
      }, ADD_ACTIVATED_DEFERS);
    }
    this.activatableEle = el;
  }

  private addActivated(el: HTMLElement, x: number, y: number) {
    this.lastActivated = Date.now();
    el.classList.add(ACTIVATED);

    const event = new CustomEvent('ionActivated', {
      bubbles: false,
      detail: {x, y}
    });
    el.dispatchEvent(event);
  }

  private removeActivated(smooth: boolean) {
    const activatableEle = this.activatableEle;
    if (!activatableEle) {
      return;
    }
    const time = CLEAR_STATE_DEFERS - Date.now() + this.lastActivated;
    if (smooth && time > 0) {
      const deferId = setTimeout(() => {
        activatableEle.classList.remove(ACTIVATED);
        this.clearDefers.delete(activatableEle);
      }, CLEAR_STATE_DEFERS);
      this.clearDefers.set(activatableEle, deferId);
    } else {
      activatableEle.classList.remove(ACTIVATED);
    }
  }
}

function getActivatableTarget(el: HTMLElement): any {
  return el.closest('a,button,[tappable]');
}

const ACTIVATED = 'activated';
const ADD_ACTIVATED_DEFERS = 200;
const CLEAR_STATE_DEFERS = 200;
const MOUSE_WAIT = 2500;

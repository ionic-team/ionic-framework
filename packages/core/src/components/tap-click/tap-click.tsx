import { Component, Element, EventListenerEnable, Listen, Prop } from '@stencil/core';
import { now, pointerCoordX, pointerCoordY } from '../../utils/helpers';
import { GestureController } from '../gesture-controller/gesture-controller';

declare const Ionic: { gesture: GestureController };


@Component({
  tag: 'ion-tap-click',
})
export class TapClick {

  private app: HTMLIonAppElement;
  private lastTouch = 0;
  private lastActivated = 0;

  private gestureCtrl: GestureController;

  private activatableEle: HTMLElement | null;
  private activeDefer: any;

  private clearDefers = new WeakMap<HTMLElement, any>();

  passive = true;
  attachTo = 'document';

  @Prop({context: 'isServer'}) isServer: boolean;
  @Prop({context: 'enableListener'}) enableListener: EventListenerEnable;

  @Element() el: HTMLElement;

  componentDidLoad() {
    if (this.isServer) {
      return;
    }
    this.gestureCtrl = Ionic.gesture = Ionic.gesture || new GestureController();

    this.app = this.el.closest('ion-app') as HTMLIonAppElement;
  }

  @Listen('document:click', {passive: false, capture: true})
  onBodyClick(ev: Event) {
    if (this.shouldCancel()) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  // Touch Events
  @Listen('document:touchstart', { passive: true })
  onTouchStart(ev: TouchEvent) {
    this.lastTouch = now(ev);
    this.pointerDown(ev);
  }

  @Listen('document:touchcancel', { passive: true })
  onTouchCancel(ev: TouchEvent) {
    this.lastTouch = now(ev);
    this.pointerUp(ev);
  }

  @Listen('document:touchend', { passive: true })
  onTouchEnd(ev: TouchEvent) {
    this.lastTouch = now(ev);
    this.pointerUp(ev);
  }

  @Listen('document:mousedown', { passive: true })
  onMouseDown(ev: MouseEvent) {
    const t = now(ev);
    if (this.lastTouch < t - MOUSE_WAIT) {
      this.pointerDown(ev);
    }
  }

  @Listen('document:mouseup', { passive: true })
  onMouseUp(ev: TouchEvent) {
    const t = now(ev);
    if (this.lastTouch < t - MOUSE_WAIT) {
      this.pointerUp(ev);
    }
  }

  @Listen('body:ionScrollStart')
  scrollStarted() {
    clearTimeout(this.activeDefer);
    if (this.activatableEle) {
      this.removeActivated(false);
      this.activatableEle = null;
    }
  }

  private pointerDown(ev: any) {
    if (this.activatableEle) {
      return;
    }
    if (!this.shouldCancel()) {
      this.setActivatedElement(getActivatableTarget(ev.target), ev);
    }
  }

  private pointerUp(ev: UIEvent) {
    this.setActivatedElement(null, ev);
  }

  private setActivatedElement(el: HTMLElement | null, ev: UIEvent) {
    // do nothing
    const activatableEle = this.activatableEle;
    if (el && el === activatableEle) {
      return;
    }
    clearTimeout(this.activeDefer);
    this.activeDefer = null;

    const eventX = pointerCoordX(ev);
    const eventY = pointerCoordY(ev);

    // unactivate selected
    if (activatableEle) {
      if (this.clearDefers.has(activatableEle)) {
        throw new Error('internal error');
      }
      if (!activatableEle.classList.contains(ACTIVATED)) {
        this.addActivated(activatableEle, eventX, eventY);
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
        this.addActivated(el, eventX, eventY);
        this.activeDefer = null;
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


  private shouldCancel(): boolean {
    if (!this.app.isEnabled()) {
      console.debug('click prevent: appDisabled');
      return true;
    }
    if (this.gestureCtrl.isCaptured()) {
      console.debug('click prevent: tap-click (gesture is captured)');
      return true;
    }
    return false;
  }
}

function getActivatableTarget(el: HTMLElement): any {
  return el.closest('a,button,[tappable]');
}

const ACTIVATED = 'activated';
const ADD_ACTIVATED_DEFERS = 200;
const CLEAR_STATE_DEFERS = 200;
const MOUSE_WAIT = 2500;

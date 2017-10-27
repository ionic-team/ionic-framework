import { Injectable } from '@angular/core';

import { assert, runInDev } from '../util/util';
import { Activator } from './activator';
import { ActivatorBase } from './activator-base';
import { App } from '../components/app/app';
import { Config } from '../config/config';
import { DomController } from '../platform/dom-controller';
import { GestureController } from '../gestures/gesture-controller';
import { Platform } from '../platform/platform';
import { hasPointerMoved, pointerCoord } from '../util/dom';
import { POINTER_EVENT_TYPE_TOUCH, PointerEvents } from '../gestures/pointer-events';
import { RippleActivator } from './ripple';
import { UIEventManager } from '../gestures/ui-event-manager';

/**
 * @hidden
 */
@Injectable()
export class TapClick {

  private disableClick: number = 0;
  private usePolyfill: boolean;
  private activator: ActivatorBase;
  private startCoord: any;
  private activatableEle: HTMLElement;
  private events: UIEventManager;
  private pointerEvents: PointerEvents;
  private lastTouchEnd: number;
  private dispatchClick: boolean;

  constructor(
    config: Config,
    private plt: Platform,
    dom: DomController,
    private app: App,
    private gestureCtrl: GestureController
  ) {
    this.events = new UIEventManager(plt);

    let activator = config.get('activator');
    if (activator === 'ripple') {
      this.activator = new RippleActivator(app, config, dom);

    } else if (activator === 'highlight') {
      this.activator = new Activator(app, config, dom);
    }

    this.usePolyfill = config.getBoolean('tapPolyfill');
    console.debug('Using usePolyfill:', this.usePolyfill);

    const doc = plt.doc();

    this.events.listen(doc, 'click', this.click.bind(this), { passive: false, capture: true });
    this.pointerEvents = this.events.pointerEvents({
      element: <any>doc,
      pointerDown: this.pointerStart.bind(this),
      pointerMove: this.pointerMove.bind(this),
      pointerUp: this.pointerEnd.bind(this),
      passive: true
    });
    this.pointerEvents.mouseWait = DISABLE_NATIVE_CLICK_AMOUNT;
  }

  pointerStart(ev: any): boolean {
    if (this.startCoord) {
      return false;
    }
    if (!this.app.isEnabled()) {
      return false;
    }

    this.lastTouchEnd = 0;
    this.dispatchClick = true;

    if (this.plt.doc() === ev.target) {
      this.startCoord = pointerCoord(ev);
      return true;
    }

    this.activatableEle = getActivatableTarget(ev.target);
    if (!this.activatableEle) {
      this.startCoord = null;
      return false;
    }

    this.startCoord = pointerCoord(ev);
    this.activator && this.activator.downAction(ev, this.activatableEle, this.startCoord);
    return true;
  }

  pointerMove(ev: UIEvent) {
    if (this.startCoord && this.shouldCancelEvent(ev)) {
      this.pointerCancel(ev);
    }
  }

  pointerEnd(ev: any, pointerEventType: number) {
    if (!this.dispatchClick) return;

    runInDev(() => this.lastTouchEnd = Date.now());

    if (!this.startCoord) {
      return;
    }
    if (this.activator && ev.target !== this.plt.doc()) {
      let activatableEle = getActivatableTarget(ev.target) || this.activatableEle;
      if (activatableEle) {
        this.activator.upAction(ev, activatableEle, this.startCoord);
      }
    }
    if (this.usePolyfill && pointerEventType === POINTER_EVENT_TYPE_TOUCH && this.app.isEnabled()) {
      this.handleTapPolyfill(ev);
    }
    this.startCoord = null;
    this.activatableEle = null;
  }

  pointerCancel(ev: UIEvent) {
    console.debug(`pointerCancel from ${ev.type} ${Date.now()}`);

    this.startCoord = null;
    this.activatableEle = null;
    this.dispatchClick = false;
    this.activator && this.activator.clearState(false);
    this.pointerEvents.stop();
  }

  shouldCancelEvent(ev: UIEvent): boolean {
    return (
      this.app.isScrolling() ||
      this.gestureCtrl.isCaptured() ||
      hasPointerMoved(POINTER_TOLERANCE, this.startCoord, pointerCoord(ev))
    );
  }

  click(ev: any) {
    if (this.shouldCancelClick(ev)) {
      ev.preventDefault();
      ev.stopPropagation();
      return;
    }

    if (this.activator && this.plt.doc() !== ev.target) {
      // cool, a click is gonna happen, let's tell the activator
      // so the element can get the given "active" style
      const activatableEle = getActivatableTarget(ev.target);
      if (activatableEle) {
        this.activator.clickAction(ev, activatableEle, this.startCoord);
      }
    }

    runInDev(() => this.profileClickDelay(ev));
  }

  private shouldCancelClick(ev: any): boolean {
    if (this.usePolyfill) {
      if (!ev.isIonicTap && this.isDisabledNativeClick()) {
        console.debug('click prevent: nativeClick');
        return true;
      }
    } else if (!this.dispatchClick) {
      console.debug('click prevent: tap-click');
      return true;
    }
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

  private profileClickDelay(ev: any) {
    if (this.lastTouchEnd) {
      let diff = Date.now() - this.lastTouchEnd;
      if (diff < 100) {
        console.debug(`FAST click dispatched. Delay(ms):`, diff);
      } else {
        console.warn(`SLOW click dispatched. Delay(ms):`, diff, ev);
      }
      this.lastTouchEnd = null;
    } else {
      console.debug('Click dispatched. Unknown delay');
    }
  }

  handleTapPolyfill(ev: any) {
    assert(this.usePolyfill, 'this code should not be used if tapPolyfill is disabled');
    // only dispatch mouse click events from a touchend event
    // when tapPolyfill config is true, and the startCoordand endCoord
    // are not too far off from each other
    let endCoord = pointerCoord(ev);

    if (hasPointerMoved(POINTER_TOLERANCE, this.startCoord, endCoord)) {
      console.debug(`click from touch prevented by pointer moved`);
      return;
    }
    // prevent native mouse click events for XX amount of time
    this.disableClick = Date.now() + DISABLE_NATIVE_CLICK_AMOUNT;

    if (this.app.isScrolling()) {
      // do not fire off a click event while the app was scrolling
      console.debug(`click from touch prevented by scrolling ${Date.now()}`);

    } else {
      // dispatch a mouse click event
      console.debug(`create click from touch ${Date.now()}`);

      let clickEvent: any = this.plt.doc().createEvent('MouseEvents');
      clickEvent.initMouseEvent('click', true, true, this.plt.win(), 1, 0, 0, endCoord.x, endCoord.y, false, false, false, false, 0, null);
      clickEvent.isIonicTap = true;
      ev.target.dispatchEvent(clickEvent);
    }
  }

  isDisabledNativeClick() {
    return this.disableClick > Date.now();
  }

}


function getActivatableTarget(ele: HTMLElement): any {
  let targetEle = ele;
  for (let x = 0; x < 10; x++) {
    if (!targetEle) break;
    if (isActivatable(targetEle)) {
      return targetEle;
    }
    targetEle = targetEle.parentElement;
  }
  return null;
}

/**
 * @hidden
 */
export function isActivatable(ele: HTMLElement) {
  if (ACTIVATABLE_ELEMENTS.indexOf(ele.tagName) > -1) {
    return true;
  }

  for (let i = 0, l = ACTIVATABLE_ATTRIBUTES.length; i < l; i++) {
    if (ele.hasAttribute && ele.hasAttribute(ACTIVATABLE_ATTRIBUTES[i])) {
      return true;
    }
  }
  return false;
}

const ACTIVATABLE_ELEMENTS = ['A', 'BUTTON'];
const ACTIVATABLE_ATTRIBUTES = ['tappable', 'ion-button'];
const POINTER_TOLERANCE = 100;
const DISABLE_NATIVE_CLICK_AMOUNT = 2500;


/**
 * @hidden
 */
export function setupTapClick(config: Config, plt: Platform, dom: DomController, app: App, gestureCtrl: GestureController) {
  return function() {
    return new TapClick(config, plt, dom, app, gestureCtrl);
  };
}

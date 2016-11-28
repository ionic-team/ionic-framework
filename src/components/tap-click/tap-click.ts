import { Injectable, NgZone } from '@angular/core';

import { ActivatorBase } from './activator-base';
import { Activator } from './activator';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { assert } from '../../util/util';
import { hasPointerMoved, pointerCoord } from '../../util/dom';
import { RippleActivator } from './ripple';
import { UIEventManager, PointerEvents, PointerEventType } from '../../util/ui-event-manager';

/**
 * @private
 */
@Injectable()
export class TapClick {
  private disableClick: number = 0;
  private usePolyfill: boolean;
  private activator: ActivatorBase;
  private startCoord: any;
  private events: UIEventManager = new UIEventManager(false);
  private pointerEvents: PointerEvents;

  constructor(
    config: Config,
    private app: App,
    zone: NgZone
  ) {
    let activator = config.get('activator');
    if (activator === 'ripple') {
      this.activator = new RippleActivator(app, config);

    } else if (activator === 'highlight') {
      this.activator = new Activator(app, config);
    }

    this.usePolyfill = config.getBoolean('tapPolyfill');
    console.debug('Using usePolyfill:', this.usePolyfill);

    this.events.listen(document, 'click', this.click.bind(this), true);
    this.pointerEvents = this.events.pointerEvents({
      element: <any>document,
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
    let activatableEle = getActivatableTarget(ev.target);
    if (!activatableEle) {
      this.startCoord = null;
      return false;
    }
    this.startCoord = pointerCoord(ev);
    this.activator && this.activator.downAction(ev, activatableEle, this.startCoord);
    return true;
  }

  pointerMove(ev: UIEvent) {
    if (!this.startCoord ||
      hasPointerMoved(POINTER_TOLERANCE, this.startCoord, pointerCoord(ev)) ||
      this.app.isScrolling()) {
      this.pointerCancel(ev);
    }
  }

  pointerEnd(ev: any, type: PointerEventType) {
    if (!this.startCoord) {
      return;
    }
    if (this.activator) {
      let activatableEle = getActivatableTarget(ev.target);
      if (activatableEle) {
        this.activator.upAction(ev, activatableEle, this.startCoord);
      }
    }
    if (this.usePolyfill && type === PointerEventType.TOUCH && this.app.isEnabled()) {
      this.handleTapPolyfill(ev);
    }
    this.startCoord = null;
  }

  pointerCancel(ev: UIEvent) {
    console.debug(`pointerCancel from ${ev.type} ${Date.now()}`);
    this.startCoord = null;
    this.activator && this.activator.clearState();
    this.pointerEvents.stop();
  }

  click(ev: any) {
    let preventReason: string = null;

    if (!this.app.isEnabled()) {
      preventReason = 'appDisabled';

    } else if (this.usePolyfill && !ev.isIonicTap && this.isDisabledNativeClick()) {
      preventReason = 'nativeClick';
    }

    if (preventReason !== null) {
      // darn, there was a reason to prevent this click, let's not allow it
      console.debug(`click prevent ${preventReason} ${Date.now()}`);
      ev.preventDefault();
      ev.stopPropagation();

    } else if (this.activator) {
      // cool, a click is gonna happen, let's tell the activator
      // so the element can get the given "active" style
      const activatableEle = getActivatableTarget(ev.target);
      if (activatableEle) {
        this.activator.clickAction(ev, activatableEle, this.startCoord);
      }
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

      let clickEvent: any = document.createEvent('MouseEvents');
      clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0, endCoord.x, endCoord.y, false, false, false, false, 0, null);
      clickEvent.isIonicTap = true;
      ev.target.dispatchEvent(clickEvent);
    }
  }

  isDisabledNativeClick() {
    return this.disableClick > Date.now();
  }

}


function getActivatableTarget(ele: HTMLElement) {
  let targetEle = ele;
  for (let x = 0; x < 10; x++) {
    if (!targetEle) break;
    if (isActivatable(targetEle)) return targetEle;
    targetEle = targetEle.parentElement;
  }
  return null;
}

/**
 * @private
 */
export const isActivatable = function (ele: HTMLElement) {
  if (ACTIVATABLE_ELEMENTS.indexOf(ele.tagName) > -1) {
    return true;
  }

  for (let i = 0, l = ACTIVATABLE_ATTRIBUTES.length; i < l; i++) {
    if (ele.hasAttribute(ACTIVATABLE_ATTRIBUTES[i])) {
      return true;
    }
  }
  return false;
};

const ACTIVATABLE_ELEMENTS = ['A', 'BUTTON'];
const ACTIVATABLE_ATTRIBUTES = ['tappable', 'ion-button'];
const POINTER_TOLERANCE = 60;
const DISABLE_NATIVE_CLICK_AMOUNT = 2500;

export function setupTapClick(config: Config, app: App, zone: NgZone) {
  return function() {
    return new TapClick(config, app, zone);
  };
}

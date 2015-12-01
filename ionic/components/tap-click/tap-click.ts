import {Injectable, NgZone} from 'angular2/angular2';

import {IonicApp} from '../app/app';
import {Config} from '../../config/config';
import {pointerCoord, hasPointerMoved} from '../../util/dom';
import {Activator} from './activator';
import {RippleActivator} from './ripple';


/**
 * @private
 */
@Injectable()
export class TapClick {
  constructor(app: IonicApp, config: Config, zone: NgZone) {
    this.app = app;
    this.zone = zone;

    this.lastTouch = 0;
    this.disableClick = 0;
    this.lastActivated = 0;

    if (config.get('activator') == 'ripple') {
      this.activator = new RippleActivator(app, config, zone);

    } else if (config.get('activator') == 'highlight') {
      this.activator = new Activator(app, config, zone);
    }

    this.usePolyfill = (config.get('tapPolyfill') === true);

    zone.runOutsideAngular(() => {
      addListener('click', this.click.bind(this), true);

      addListener('touchstart', this.touchStart.bind(this));
      addListener('touchend', this.touchEnd.bind(this));
      addListener('touchcancel', this.pointerCancel.bind(this));

      addListener('mousedown', this.mouseDown.bind(this), true);
      addListener('mouseup', this.mouseUp.bind(this), true);
    });
  }

  touchStart(ev) {
    this.lastTouch = Date.now();
    this.pointerStart(ev);
  }

  touchEnd(ev) {
    this.lastTouch = Date.now();

    if (this.usePolyfill && this.startCoord && this.app.isEnabled()) {
      let endCoord = pointerCoord(ev);

      if (!hasPointerMoved(POINTER_TOLERANCE, this.startCoord, endCoord)) {
        console.debug('create click from touch');

        // prevent native mouse click events for XX amount of time
        this.disableClick = this.lastTouch + DISABLE_NATIVE_CLICK_AMOUNT;

        // manually dispatch the mouse click event
        let clickEvent = document.createEvent('MouseEvents');
        clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0, endCoord.x, endCoord.y, false, false, false, false, 0, null);
        clickEvent.isIonicTap = true;
        ev.target.dispatchEvent(clickEvent);
      }
    }

    this.pointerEnd(ev);
  }

  mouseDown(ev) {
    if (this.isDisabledNativeClick()) {
      console.debug('mouseDown prevent', ev.target.tagName);
      // does not prevent default on purpose
      // so native blur events from inputs can happen
      ev.stopPropagation();

    } else if (this.lastTouch + DISABLE_NATIVE_CLICK_AMOUNT < Date.now()) {
      this.pointerStart(ev);
    }
  }

  mouseUp(ev) {
    if (this.isDisabledNativeClick()) {
      console.debug('mouseUp prevent', ev.target.tagName);
      ev.preventDefault();
      ev.stopPropagation();
    }

    if (this.lastTouch + DISABLE_NATIVE_CLICK_AMOUNT < Date.now()) {
      this.pointerEnd(ev);
    }
  }

  pointerStart(ev) {
    let activatableEle = getActivatableTarget(ev.target);

    if (activatableEle) {
      this.startCoord = pointerCoord(ev);

      let now = Date.now();
      if (this.lastActivated + 150 < now) {
        this.activator && this.activator.downAction(ev, activatableEle, this.startCoord.x, this.startCoord.y);
        this.lastActivated = now;
      }

      this.moveListeners(true);

    } else {
      this.startCoord = null;
    }
  }

  pointerEnd(ev) {
    this.moveListeners(false);
    this.activator && this.activator.upAction();
  }

  pointerMove(ev) {
    if ( hasPointerMoved(POINTER_MOVE_UNTIL_CANCEL, this.startCoord, pointerCoord(ev)) ) {
      this.pointerCancel(ev);
    }
  }

  pointerCancel(ev) {
    console.debug('pointerCancel from', ev.type);
    this.activator && this.activator.clearState();
    this.moveListeners(false);
  }

  moveListeners(shouldAdd) {
    this.zone.runOutsideAngular(() => {
      if (shouldAdd) {
        addListener(this.usePolyfill ? 'touchmove' : 'mousemove', this.pointerMove.bind(this));
      } else {
        removeListener(this.usePolyfill ? 'touchmove' : 'mousemove', this.pointerMove.bind(this));
      }
    });
  }

  click(ev) {
    let preventReason = null;

    if (!this.app.isEnabled()) {
      preventReason = 'appDisabled';

    } else if (!ev.isIonicTap && this.isDisabledNativeClick()) {
      preventReason = 'nativeClick';
    }

    if (preventReason !== null) {
      console.debug('click prevent', preventReason);
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  isDisabledNativeClick() {
    return this.disableClick > Date.now();
  }

}


function getActivatableTarget(ele) {
  let targetEle = ele;
  for (let x = 0; x < 4; x++) {
    if (!targetEle) break;
    if (isActivatable(targetEle)) return targetEle;
    targetEle = targetEle.parentElement;
  }
  return null;
}

/**
 * @private
 */
export function isActivatable(ele) {
  if (ACTIVATABLE_ELEMENTS.test(ele.tagName)) {
    return true;
  }

  let attributes = ele.attributes;
  for (let i = 0, l = attributes.length; i < l; i++) {
    if (ACTIVATABLE_ATTRIBUTES.test(attributes[i].name)) {
      return true;
    }
  }

  return false;
}

function addListener(type, listener, useCapture) {
  document.addEventListener(type, listener, useCapture);
}

function removeListener(type, listener) {
  document.removeEventListener(type, listener);
}

const ACTIVATABLE_ELEMENTS = /^(A|BUTTON)$/;
const ACTIVATABLE_ATTRIBUTES = /tappable/;
const POINTER_TOLERANCE = 4;
const POINTER_MOVE_UNTIL_CANCEL = 10;
const DISABLE_NATIVE_CLICK_AMOUNT = 2500;

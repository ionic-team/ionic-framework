import {pointerCoord, hasPointerMoved, transitionEnd} from '../../util/dom';
import {Activator} from './activator';
import {RippleActivator} from './ripple';


let startCoord = null;
let pointerTolerance = 4;
let lastTouch = 0;
let lastActivated = 0;
let disableNativeClickUntil = 0;
let disableNativeClickAmount = 3000;
let activator = null;
let isTapPolyfill = false;
let app = null;
let win = null;
let doc = null;


/**
 * @private
 */
export function initTapClick(windowInstance, documentInstance, appInstance, config) {
  win = windowInstance;
  doc = documentInstance;
  app = appInstance;

  if (config.get('activator') == 'ripple') {
    activator = new RippleActivator(app, config);

  } else if (config.get('activator') == 'highlight') {
    activator = new Activator(app, config);
  }

  isTapPolyfill = (config.get('tapPolyfill') === true);

  addListener('click', click, true);

  addListener('touchstart', touchStart);
  addListener('touchend', touchEnd);
  addListener('touchcancel', touchCancel);

  addListener('mousedown', mouseDown, true);
  addListener('mouseup', mouseUp, true);
}


function touchStart(ev) {
  touchAction();
  pointerStart(ev);
}

function touchEnd(ev) {
  touchAction();

  if (isTapPolyfill && startCoord && app.isEnabled()) {
    let endCoord = pointerCoord(ev);

    if (!hasPointerMoved(pointerTolerance, startCoord, endCoord)) {
      console.debug('create click from touch');

      disableNativeClickUntil = Date.now() + disableNativeClickAmount;

      let clickEvent = doc.createEvent('MouseEvents');
      clickEvent.initMouseEvent('click', true, true, win, 1, 0, 0, endCoord.x, endCoord.y, false, false, false, false, 0, null);
      clickEvent.isIonicTap = true;
      ev.target.dispatchEvent(clickEvent);
    }
  }

  pointerEnd(ev);
}

function touchCancel(ev) {
  touchAction();
  pointerCancel(ev);
}

function mouseDown(ev) {
  if (isDisabledNativeClick()) {
    console.debug('mouseDown prevent');
    ev.preventDefault();
    ev.stopPropagation();

  } else if (lastTouch + disableNativeClickAmount < Date.now()) {
    pointerStart(ev);
  }
}

function mouseUp(ev) {
  if (isDisabledNativeClick()) {
    console.debug('mouseUp prevent');
    ev.preventDefault();
    ev.stopPropagation();
  }

  if (lastTouch + disableNativeClickAmount < Date.now()) {
    pointerEnd(ev);
  }
}

function pointerStart(ev) {
  let activatableEle = getActivatableTarget(ev.target);

  if (activatableEle) {
    startCoord = pointerCoord(ev);

    let now = Date.now();
    if (lastActivated + 150 < now) {
      activator && activator.downAction(ev, activatableEle, startCoord.x, startCoord.y);
      lastActivated = now;
    }

    moveListeners(true);

  } else {
    startCoord = null;
  }
}

function pointerEnd(ev) {
  moveListeners(false);
  activator && activator.upAction();
}

function pointerMove(ev) {
  let moveCoord = pointerCoord(ev);

  if ( hasPointerMoved(10, startCoord, moveCoord) ) {
    pointerCancel(ev);
  }
}

function pointerCancel(ev) {
  console.debug('pointerCancel from', ev.type);
  activator && activator.clearState();
  moveListeners(false);
}

function moveListeners(shouldAdd) {
  if (shouldAdd) {
    if (isTapPolyfill) {
      addListener('touchmove', pointerMove);
    }
    addListener('mousemove', pointerMove);

  } else {
    if (isTapPolyfill) {
      removeListener('touchmove', pointerMove);
    }
    removeListener('mousemove', pointerMove);
  }
}

function setDisableNativeClick() {
  if (isTapPolyfill) {
    disableNativeClickTime = Date.now() + disableNativeClickLimit;
  }
}

function isDisabledNativeClick() {
  return disableNativeClickUntil > Date.now();
}

function click(ev) {
  let preventReason = null;

  if (!app.isEnabled()) {
    preventReason = 'appDisabled';

  } else if (!ev.isIonicTap && isDisabledNativeClick()) {
    preventReason = 'nativeClick';
  }

  if (preventReason !== null) {
    console.debug('click prevent', preventReason);
    ev.preventDefault();
    ev.stopPropagation();
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

function touchAction() {
  lastTouch = Date.now();
}

function addListener(type, listener, useCapture) {
  doc.addEventListener(type, listener, useCapture);
}

function removeListener(type, listener) {
  doc.removeEventListener(type, listener);
}

const ACTIVATABLE_ELEMENTS = /^(A|BUTTON)$/;
const ACTIVATABLE_ATTRIBUTES = /tappable/;

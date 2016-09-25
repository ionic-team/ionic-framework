
// RequestAnimationFrame Polyfill (Android 4.3 and below)
/*! @author Paul Irish */
/*! @source https://gist.github.com/paulirish/1579671 */
(function() {
  var rafLastTime = 0;
  const win: any = window;
  if (!win.requestAnimationFrame) {
    win.requestAnimationFrame = function(callback: Function) {
      var currTime = Date.now();
      var timeToCall = Math.max(0, 16 - (currTime - rafLastTime));

      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);

      rafLastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!win.cancelAnimationFrame) {
    win.cancelAnimationFrame = function(id: number) { clearTimeout(id); };
  }
})();

// use native raf rather than the zone wrapped one
let originalRaf = (window[window['Zone']['__symbol__']('requestAnimationFrame')] || window[window['Zone']['__symbol__']('webkitRequestAnimationFrame')]);
// if the originalRaf from the Zone symbol is not available, we need to provide the polyfilled version
export const nativeRaf = originalRaf !== undefined ? originalRaf['bind'](window) : window.requestAnimationFrame.bind(window);

// zone wrapped raf
export const raf = window.requestAnimationFrame.bind(window);
export const cancelRaf = window.cancelAnimationFrame.bind(window);

export const nativeTimeout = window[window['Zone']['__symbol__']('setTimeout')]['bind'](window);
export const clearNativeTimeout = window[window['Zone']['__symbol__']('clearTimeout')]['bind'](window);

export function rafFrames(framesToWait: number, callback: Function) {
  framesToWait = Math.ceil(framesToWait);

  if (framesToWait < 2) {
    nativeRaf(callback);

  } else {
    nativeTimeout(() => {
      nativeRaf(callback);
    }, (framesToWait - 1) * 16.6667);
  }
}

// TODO: DRY rafFrames and zoneRafFrames
export function zoneRafFrames(framesToWait: number, callback: Function) {
  framesToWait = Math.ceil(framesToWait);

  if (framesToWait < 2) {
    raf(callback);

  } else {
    setTimeout(() => {
      raf(callback);
    }, (framesToWait - 1) * 16.6667);
  }
}

export let CSS: {
  transform?: string,
  transition?: string,
  transitionDuration?: string,
  transitionDelay?: string,
  transitionTimingFn?: string,
  transitionStart?: string,
  transitionEnd?: string,
  transformOrigin?: string
} = {};

(function() {
  // transform
  var i: number;
  var keys = ['webkitTransform', 'transform', '-webkit-transform', 'webkit-transform',
                 '-moz-transform', 'moz-transform', 'MozTransform', 'mozTransform', 'msTransform'];

  for (i = 0; i < keys.length; i++) {
    if ((<any>document.documentElement.style)[keys[i]] !== undefined) {
      CSS.transform = keys[i];
      break;
    }
  }

  // transition
  keys = ['webkitTransition', 'mozTransition', 'msTransition', 'transition'];
  for (i = 0; i < keys.length; i++) {
    if ((<any>document.documentElement.style)[keys[i]] !== undefined) {
      CSS.transition = keys[i];
      break;
    }
  }

  // The only prefix we care about is webkit for transitions.
  var isWebkit = CSS.transition.indexOf('webkit') > -1;

  // transition duration
  CSS.transitionDuration = (isWebkit ? '-webkit-' : '') + 'transition-duration';

  // transition timing function
  CSS.transitionTimingFn = (isWebkit ? '-webkit-' : '') + 'transition-timing-function';

  // transition delay
  CSS.transitionDelay = (isWebkit ? '-webkit-' : '') + 'transition-delay';

  // To be sure transitionend works everywhere, include *both* the webkit and non-webkit events
  CSS.transitionEnd = (isWebkit ? 'webkitTransitionEnd ' : '') + 'transitionend';

  // transform origin
  CSS.transformOrigin = (isWebkit ? '-webkit-' : '') + 'transform-origin';
})();


export function transitionEnd(el: HTMLElement, callback: Function) {
  if (el) {
    CSS.transitionEnd.split(' ').forEach(eventName => {
      el.addEventListener(eventName, onEvent);
    });

    return unregister;
  }

  function unregister() {
    CSS.transitionEnd.split(' ').forEach(eventName => {
      el.removeEventListener(eventName, onEvent);
    });
  }

  function onEvent(ev: UIEvent) {
    if (el === ev.target) {
      unregister();
      callback(ev);
    }
  }
}

export function ready(callback?: Function) {
  let promise: Promise<any> = null;

  if (!callback) {
    // a callback wasn't provided, so let's return a promise instead
    promise = new Promise(resolve => { callback = resolve; });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    callback();

  } else {
    document.addEventListener('DOMContentLoaded', completed, false);
    window.addEventListener('load', completed, false);
  }

  return promise;

  function completed() {
    document.removeEventListener('DOMContentLoaded', completed, false);
    window.removeEventListener('load', completed, false);
    callback();
  }
}

export function windowLoad(callback?: Function) {
  let promise: Promise<any> = null;

  if (!callback) {
    // a callback wasn't provided, so let's return a promise instead
    promise = new Promise(resolve => { callback = resolve; });
  }

  if (document.readyState === 'complete') {
    callback();

  } else {

    window.addEventListener('load', completed, false);
  }

  return promise;

  function completed() {
    window.removeEventListener('load', completed, false);
    callback();
  }
}

export function pointerCoord(ev: any): PointerCoordinates {
  // get coordinates for either a mouse click
  // or a touch depending on the given event
  let c = { x: 0, y: 0 };
  if (ev) {
    const touches = ev.touches && ev.touches.length ? ev.touches : [ev];
    const e = (ev.changedTouches && ev.changedTouches[0]) || touches[0];
    if (e) {
      c.x = e.clientX || e.pageX || 0;
      c.y = e.clientY || e.pageY || 0;
    }
  }
  return c;
}

export function hasPointerMoved(threshold: number, startCoord: PointerCoordinates, endCoord: PointerCoordinates) {
  let deltaX = (startCoord.x - endCoord.x);
  let deltaY = (startCoord.y - endCoord.y);
  let distance = deltaX * deltaX + deltaY * deltaY;
  return distance > (threshold * threshold);
}

export function isActive(ele: HTMLElement) {
  return !!(ele && (document.activeElement === ele));
}

export function hasFocus(ele: HTMLElement) {
  return isActive(ele) && (ele.parentElement.querySelector(':focus') === ele);
}

export function isTextInput(ele: any) {
  return !!ele &&
         (ele.tagName === 'TEXTAREA' ||
          ele.contentEditable === 'true' ||
          (ele.tagName === 'INPUT' && !(/^(radio|checkbox|range|file|submit|reset|color|image|button)$/i).test(ele.type)));
}

export function hasFocusedTextInput() {
  let ele = <HTMLElement>document.activeElement;
  if (isTextInput(ele)) {
    return (ele.parentElement.querySelector(':focus') === ele);
  }
  return false;
}

const skipInputAttrsReg = /^(value|checked|disabled|type|class|style|id|autofocus|autocomplete|autocorrect)$/i;
export function copyInputAttributes(srcElement: HTMLElement, destElement: HTMLElement) {
  // copy attributes from one element to another
  // however, skip over a few of them as they're already
  // handled in the angular world
  var attrs = srcElement.attributes;
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!skipInputAttrsReg.test(attr.name)) {
      destElement.setAttribute(attr.name, attr.value);
    }
  }
}


/**
 * Get the element offsetWidth and offsetHeight. Values are cached
 * to reduce DOM reads. Cache is cleared on a window resize.
 */
export function getDimensions(ele: HTMLElement, id: string): {
  width: number, height: number, left: number, top: number
} {
  let dimensions = dimensionCache[id];
  if (!dimensions) {
    // make sure we got good values before caching
    if (ele.offsetWidth && ele.offsetHeight) {
      dimensions = dimensionCache[id] = {
        width: ele.offsetWidth,
        height: ele.offsetHeight,
        left: ele.offsetLeft,
        top: ele.offsetTop
      };

    } else {
      // do not cache bad values
      return { width: 0, height: 0, left: 0, top: 0 };
    }
  }

  return dimensions;
}

export function clearDimensions(id: string) {
  delete dimensionCache[id];
}

export function windowDimensions(): {width: number, height: number} {
  if (!dimensionCache.win) {
    // make sure we got good values before caching
    if (window.innerWidth && window.innerHeight) {
      dimensionCache.win = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    } else {
      // do not cache bad values
      return { width: 0, height: 0 };
    }
  }
  return dimensionCache.win;
}

export function flushDimensionCache() {
  dimensionCache = {};
}

let dimensionCache: any = {};


export interface PointerCoordinates {
  x?: number;
  y?: number;
}

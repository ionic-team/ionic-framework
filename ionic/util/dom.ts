
let win: any = window;
let doc: any = document;
let docEle: any = doc.documentElement;


// RequestAnimationFrame Polyfill (Android 4.3 and below)
/*! @author Paul Irish */
/*! @source https://gist.github.com/paulirish/1579671 */
(function() {
  var rafLastTime = 0;
  if (!win.requestAnimationFrame) {
    win.requestAnimationFrame = function(callback, element) {
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
    win.cancelAnimationFrame = function(id) { clearTimeout(id); };
  }
})();

export const raf = win.requestAnimationFrame.bind(win);
export const cancelRaf = win.cancelAnimationFrame.bind(win);


export function rafFrames(framesToWait, callback) {
  framesToWait = Math.ceil(framesToWait);

  if (framesToWait < 2) {
    raf(callback);

  } else {
    setTimeout(() => {
      raf(callback);
    }, (framesToWait - 1) * 17);
  }
}

export let CSS: {
  transform?: string,
  transition?: string,
  transitionDuration?: string,
  transitionTimingFn?: string,
  transitionStart?: string,
  transitionEnd?: string,
} = {};

(function() {
  // transform
  var i, keys = ['webkitTransform', 'transform', '-webkit-transform', 'webkit-transform',
                 '-moz-transform', 'moz-transform', 'MozTransform', 'mozTransform', 'msTransform'];

  for (i = 0; i < keys.length; i++) {
    if (docEle.style[keys[i]] !== undefined) {
      CSS.transform = keys[i];
      break;
    }
  }

  // transition
  keys = ['webkitTransition', 'mozTransition', 'msTransition', 'transition'];
  for (i = 0; i < keys.length; i++) {
    if (docEle.style[keys[i]] !== undefined) {
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

  // To be sure transitionend works everywhere, include *both* the webkit and non-webkit events
  CSS.transitionEnd = (isWebkit ? 'webkitTransitionEnd ' : '') + 'transitionend';
})();


export function transitionEnd(el: HTMLElement, callback: Function) {
  if (el) {
    function deregister() {
      CSS.transitionEnd.split(' ').forEach(eventName => {
        el.removeEventListener(eventName, onEvent);
      });
    }

    function onEvent(ev) {
      if (el === ev.target) {
        deregister();
        callback(ev);
      }
    }

    CSS.transitionEnd.split(' ').forEach(eventName => {
      el.addEventListener(eventName, onEvent);
    });

    return deregister;
  }
}

export function ready(callback?: Function) {
  let promise = null;

  if (!callback) {
    // a callback wasn't provided, so let's return a promise instead
    promise = new Promise(resolve => { callback = resolve; });
  }

  if (doc.readyState === 'complete' || doc.readyState === 'interactive') {
    callback();

  } else {
    function completed() {
      doc.removeEventListener('DOMContentLoaded', completed, false);
      win.removeEventListener('load', completed, false);
      callback();
    }

    doc.addEventListener('DOMContentLoaded', completed, false);
    win.addEventListener('load', completed, false);
  }

  return promise;
}

export function windowLoad(callback?: Function) {
  let promise = null;

  if (!callback) {
    // a callback wasn't provided, so let's return a promise instead
    promise = new Promise(resolve => { callback = resolve; });
  }

  if (doc.readyState === 'complete') {
    callback();

  } else {
    function completed() {
      win.removeEventListener('load', completed, false);
      callback();
    }

    win.addEventListener('load', completed, false);
  }

  return promise;
}

export function pointerCoord(ev): {x: number, y: number} {
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

export function hasPointerMoved(threshold, startCoord, endCoord) {
  return startCoord && endCoord &&
         (Math.abs(startCoord.x - endCoord.x) > threshold || Math.abs(startCoord.y - endCoord.y) > threshold);
}

export function isActive(ele) {
  return !!(ele && (doc.activeElement === ele));
}

export function hasFocus(ele) {
  return isActive(ele) && (ele.parentElement.querySelector(':focus') === ele);
}

export function isTextInput(ele) {
  return !!ele &&
         (ele.tagName == 'TEXTAREA' ||
          ele.contentEditable === 'true' ||
          (ele.tagName == 'INPUT' && !(/^(radio|checkbox|range|file|submit|reset|color|image|button)$/i).test(ele.type)));
}

export function hasFocusedTextInput() {
  let ele = doc.activeElement;
  if (isTextInput(ele)) {
    return (ele.parentElement.querySelector(':focus') === ele);
  }
  return false;
}

const skipInputAttrsReg = /^(value|checked|disabled|type|class|style|id)$/i
export function copyInputAttributes(srcElement, destElement) {
  // copy attributes from one element to another
  // however, skip over a few of them as they're already
  // handled in the angular world
  let attrs = srcElement.attributes;
  for (let i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!skipInputAttrsReg.test(attr.name)) {
      destElement.setAttribute(attr.name, attr.value);
    }
  }
}

let matchesFn: string;
let matchesMethods: Array<string> = ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector'];
matchesMethods.some((fn: string) => {
  if (typeof docEle[fn] == 'function') {
    matchesFn = fn;
    return true;
  }
});

export function closest(ele: HTMLElement, selector: string, checkSelf?: boolean) {
  if (ele && matchesFn) {

    // traverse parents
    ele = (checkSelf ? ele : ele.parentElement);

    while (ele !== null) {
      if (ele[matchesFn](selector)) {
        return ele;
      }
      ele = ele.parentElement;
    }
  }

  return null;
}


/**
 * Get the element offsetWidth and offsetHeight. Values are cached
 * to reduce DOM reads. Cache is cleared on a window resize.
 * @param {TODO} ele  TODO
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

export function windowDimensions(): {width: number, height: number} {
  if (!dimensionCache.win) {
    // make sure we got good values before caching
    if (win.innerWidth && win.innerHeight) {
      dimensionCache.win = {
        width: win.innerWidth,
        height: win.innerHeight
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

let dimensionCache:any = {};


let win: any = window;
let doc: any = document;
let docEle: any = doc.documentElement;

// requestAnimationFrame is polyfilled for old Android
// within the web-animations polyfill
export const raf = win.requestAnimationFrame;

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
  animationStart?: string,
  animationEnd?: string,
  transform?: string,
  transition?: string,
  transitionDuration?: string,
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

  // To be sure transitionend works everywhere, include *both* the webkit and non-webkit events
  CSS.transitionEnd = (isWebkit ? 'webkitTransitionEnd ' : '') + 'transitionend';
})();

if (win.onanimationend === undefined && win.onwebkitanimationend !== undefined) {
  CSS.animationStart = 'webkitAnimationStart animationstart';
  CSS.animationEnd = 'webkitAnimationEnd animationend';
} else {
  CSS.animationStart = 'animationstart';
  CSS.animationEnd = 'animationend';
}

export function transitionEnd(el: HTMLElement) {
  return cssPromise(el, CSS.transitionEnd);
}

export function animationStart(el: HTMLElement, animationName: string) {
  return cssPromise(el, CSS.animationStart, animationName);
}

export function animationEnd(el: HTMLElement, animationName: string) {
  return cssPromise(el, CSS.animationEnd, animationName);
}

function cssPromise(el: HTMLElement, eventNames: string, animationName?: string) {
  return new Promise(resolve => {
    eventNames.split(' ').forEach(eventName => {
      el.addEventListener(eventName, onEvent);
    })
    function onEvent(ev) {
      if (ev.animationName && animationName) {
        // do not resolve if a bubbled up ev.animationName
        // is not the same as the passed in animationName arg
        if (ev.animationName !== animationName) {
          return;
        }
      } else if (ev.target !== el) {
        // do not resolve if the event's target element is not
        // the same as the element the listener was added to
        return;
      }
      ev.stopPropagation();
      eventNames.split(' ').forEach(eventName => {
        el.removeEventListener(eventName, onEvent);
      })
      resolve(ev);
    }
  });
}

export function ready(callback) {
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

export function windowLoad(callback) {
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

export function removeElement(ele) {
  ele && ele.parentNode && ele.parentNode.removeChild(ele);
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

export function windowDimensions() {
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

function isStaticPositioned(element) {
  return (element.style.position || 'static') === 'static';
}

/**
 * returns the closest, non-statically positioned parentOffset of a given element
 * @param element
 */
export function parentOffsetEl(element) {
  var offsetParent = element.offsetParent || doc;
  while (offsetParent && offsetParent !== doc && isStaticPositioned(offsetParent)) {
    offsetParent = offsetParent.offsetParent;
  }
  return offsetParent || doc;
};

/**
 * Get the current coordinates of the element, relative to the offset parent.
 * Read-only equivalent of [jQuery's position function](http://api.jquery.com/position/).
 * @param {element} element The element to get the position of.
 * @returns {object} Returns an object containing the properties top, left, width and height.
 */
export function position(element) {
  var elBCR = offset(element);
  var offsetParentBCR = { top: 0, left: 0 };
  var offsetParentEl = parentOffsetEl(element);
  if (offsetParentEl != doc) {
    offsetParentBCR = offset(offsetParentEl);
    offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
    offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
  }

  var boundingClientRect = element.getBoundingClientRect();
  return {
    width: boundingClientRect.width || element.offsetWidth,
    height: boundingClientRect.height || element.offsetHeight,
    top: elBCR.top - offsetParentBCR.top,
    left: elBCR.left - offsetParentBCR.left
  };
}

/**
* Get the current coordinates of the element, relative to the doc.
* Read-only equivalent of [jQuery's offset function](http://api.jquery.com/offset/).
* @param {element} element The element to get the offset of.
* @returns {object} Returns an object containing the properties top, left, width and height.
*/
export function offset(element) {
 var boundingClientRect = element.getBoundingClientRect();
 return {
   width: boundingClientRect.width || element.offsetWidth,
   height: boundingClientRect.height || element.offsetHeight,
   top: boundingClientRect.top + (win.pageYOffset || docEle.scrollTop),
   left: boundingClientRect.left + (win.pageXOffset || docEle.scrollLeft)
 };
}

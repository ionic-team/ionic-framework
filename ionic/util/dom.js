
const nativeRaf = window.requestAnimationFrame ||
   window.webkitRequestAnimationFrame ||
   window.mozRequestAnimationFrame;

const nativeCancelRaf = window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.webkitCancelRequestAnimationFrame;

export const raf = nativeRaf || function(callback) {
    let timeCurrent = (new Date()).getTime(),
        timeDelta;

    /* Dynamically set delay on a per-tick basis to match 60fps. */
    /* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
    timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
    timeLast = timeCurrent + timeDelta;

    return setTimeout(function() { callback(timeCurrent + timeDelta); }, timeDelta);
}

export const rafCancel = nativeRaf ? nativeCancelRaf : function(id) {
  return window.cancelTimeout(id);
}

export function rafPromise() {
  return new Promise(resolve => raf(resolve));
}

export const isSVG = val => window.SVGElement && (val instanceof window.SVGElement);


// We only need to test for webkit in our supported browsers. Webkit is the
// only  browser still using prefixes. Code adapted from angular-animate.js
export let CSS = {};
if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
  CSS.prefix = '-webkit-';
  CSS.transition = 'webkitTransition';
  CSS.transform = 'webkitTransform';
  CSS.transitionEnd = 'webkitTransitionEnd transitionend';
} else {
  CSS.prefix = '';
  CSS.transform = 'transform';
  CSS.transition = 'transition';
  CSS.transitionEnd = 'transitionend';
}

if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
  CSS.animation = 'WebkitAnimation';
  CSS.animationStart = 'webkitAnimationStart animationstart';
  CSS.animationEnd = 'webkitAnimationEnd animationend';
} else {
  CSS.animation = 'animation';
  CSS.animationStart = 'animationstart';
  CSS.animationEnd = 'animationend';
}

export function transitionEnd(el:Element) {
  return cssPromise(el, CSS.transitionEnd);
}

export function animationStart(el:Element, animationName) {
  return cssPromise(el, CSS.animationStart, animationName);
}

export function animationEnd(el:Element, animationName) {
  return cssPromise(el, CSS.animationEnd, animationName);
}

function cssPromise(el:Element, eventNames, animationName) {
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

export function ready() {
  return new Promise(resolve => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(resolve);

    } else {

      function completed() {
        document.removeEventListener('DOMContentLoaded', completed, false);
        window.removeEventListener('load', completed, false);
        resolve();
      }

      document.addEventListener('DOMContentLoaded', completed, false);
      window.addEventListener('load', completed, false);
    }
  })
}

export function windowLoad() {
  return new Promise(resolve => {
    if (document.readyState === 'complete') {
      setTimeout(resolve);

    } else {
      function completed() {
        window.removeEventListener('load', completed, false);
        resolve();
      }

      window.addEventListener('load', completed, false);
    }
  });
}

export function hasAttribute(el: Element, attributeName) {
  return el.hasAttribute(attributeName);
}

export function addClass(el: Element, ...classNames) {
  for (let c of classNames) {
    el.classList.add(c);
  }
}

export function getChildIndex(el: Element) {
  let child;
  let parent = el.parentNode;
  for(let i = 0, j = parent.children.length; i < j; i++) {
    child = parent.children[i];
    if(child === el) {
      return i;
    }
  }
  return -1;
}

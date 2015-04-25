
const nativeRaf= window.requestAnimationFrame ||
   window.webkitRequestAnimationFrame ||
   window.mozRequestAnimationFrame

const nativeCancelRaf = window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.webkitCancelRequestAnimationFrame

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
  return window.cancelTimeout(id)
}

export function rafPromise() {
  return new Promise(resolve => raf(resolve))
}

export const isSVG = val => window.SVGElement && (val instanceof window.SVGElement)


// We only need to test for webkit in our supported browsers. Webkit is the only browser still
// using prefixes.
// Code adapted from angular-animate.js
export let css = {}
if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
  css.prefix = 'webkit'
  css.transition = 'webkitTransition'
  css.transform = 'webkitTransform'
  css.transitionEnd = 'webkitTransitionEnd transitionend'
} else {
  css.prefix = ''
  css.transform = 'transform'
  css.transition = 'transition'
  css.transitionEnd = 'transitionend'
}

export function transitionEndPromise(el:Element) {
  return new Promise(resolve => {
    css.transitionEnd.split(' ').forEach(eventName => {
      el.addEventListener(eventName, onTransitionEnd)
    })
    function onTransitionEnd(ev) {
      // Don't allow bubbled transitionend events
      if (ev.target !== el) {
        return
      }
      css.transitionEnd.split(' ').forEach(eventName => {
        el.removeEventListener(css.transitionEnd, onTransitionEnd)
      })
      resolve(ev)
    }
  })
}

export function ready() {
  return new Promise(resolve => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(resolve)

    } else {

      function completed() {
        resolve()
        document.removeEventListener('DOMContentLoaded', completed, false)
        window.removeEventListener('load', completed, false)
      }

      document.addEventListener('DOMContentLoaded', completed, false)
      window.addEventListener('load', completed, false)
    }
  })
}

export function windowLoad() {
  return new Promise(resolve => {
    if (document.readyState === 'complete') {
      setTimeout(resolve)

    } else {

      function completed() {
        resolve()
        window.removeEventListener('load', completed, false)
      }

      window.addEventListener('load', completed, false)
    }
  })
}

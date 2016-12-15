

export const CSS: {
  transform?: string,
  transition?: string,
  transitionDuration?: string,
  transitionDelay?: string,
  transitionTimingFn?: string,
  transitionStart?: string,
  transitionEnd?: string,
  transformOrigin?: string
  animationDelay?: string;
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

  // animation delay
  CSS.animationDelay = (isWebkit ? 'webkitAnimationDelay' : 'animationDelay');
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


export function pointerCoord(ev: any): PointerCoordinates {
  // get coordinates for either a mouse click
  // or a touch depending on the given event
  if (ev) {
    var changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      var touch = changedTouches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    var pageX = ev.pageX;
    if (pageX !== undefined) {
      return { x: pageX, y: ev.pageY };
    }
  }
  return { x: 0, y: 0 };
}

export function hasPointerMoved(threshold: number, startCoord: PointerCoordinates, endCoord: PointerCoordinates) {
  if (startCoord && endCoord) {
    const deltaX = (startCoord.x - endCoord.x);
    const deltaY = (startCoord.y - endCoord.y);
    const distance = deltaX * deltaX + deltaY * deltaY;
    return distance > (threshold * threshold);
  }
  return false;
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
          (ele.tagName === 'INPUT' && !(NON_TEXT_INPUT_REGEX.test(ele.type))));
}

export const NON_TEXT_INPUT_REGEX = /^(radio|checkbox|range|file|submit|reset|color|image|button)$/i;

export function hasFocusedTextInput() {
  const ele = <HTMLElement>document.activeElement;
  if (isTextInput(ele)) {
    return (ele.parentElement.querySelector(':focus') === ele);
  }
  return false;
}

export function focusOutActiveElement() {
  const activeElement = <HTMLElement>document.activeElement;
  activeElement && activeElement.blur && activeElement.blur();
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


export interface PointerCoordinates {
  x?: number;
  y?: number;
}

import type { EventEmitter } from '@stencil/core';

import type { Side } from '../components/menu/menu-interface';

// TODO(FW-2832): types

declare const __zone_symbol__requestAnimationFrame: typeof window.requestAnimationFrame;
declare const requestAnimationFrame: typeof window.requestAnimationFrame;

export const transitionEndAsync = (el: HTMLElement | null, expectedDuration = 0) => {
  return new Promise((resolve) => {
    transitionEnd(el, expectedDuration, resolve);
  });
};

/**
 * Allows developer to wait for a transition
 * to finish and fallback to a timer if the
 * transition is cancelled or otherwise
 * never finishes. Also see transitionEndAsync
 * which is an await-able version of this.
 */
const transitionEnd = (el: HTMLElement | null, expectedDuration = 0, callback: (ev?: TransitionEvent) => void) => {
  let unRegTrans: (() => void) | undefined;
  let animationTimeout: number | undefined;
  const opts: AddEventListenerOptions = { passive: true };
  const ANIMATION_FALLBACK_TIMEOUT = 500;

  const unregister = () => {
    if (unRegTrans) {
      unRegTrans();
    }
  };

  const onTransitionEnd = (ev?: Event) => {
    if (ev === undefined || el === ev.target) {
      unregister();
      callback(ev as TransitionEvent);
    }
  };

  if (el) {
    el.addEventListener('webkitTransitionEnd', onTransitionEnd, opts);
    el.addEventListener('transitionend', onTransitionEnd, opts);
    animationTimeout = setTimeout(onTransitionEnd, expectedDuration + ANIMATION_FALLBACK_TIMEOUT);

    unRegTrans = () => {
      if (animationTimeout !== undefined) {
        clearTimeout(animationTimeout);
        animationTimeout = undefined;
      }
      el.removeEventListener('webkitTransitionEnd', onTransitionEnd, opts);
      el.removeEventListener('transitionend', onTransitionEnd, opts);
    };
  }

  return unregister;
};

/**
 * Waits for a component to be ready for
 * both custom element and non-custom element builds.
 * If non-custom element build, el.componentOnReady
 * will be used.
 * For custom element builds, we wait a frame
 * so that the inner contents of the component
 * have a chance to render.
 *
 * Use this utility rather than calling
 * el.componentOnReady yourself.
 */
export const componentOnReady = (el: any, callback: any) => {
  if (el.componentOnReady) {
    // eslint-disable-next-line custom-rules/no-component-on-ready-method
    el.componentOnReady().then((resolvedEl: any) => callback(resolvedEl));
  } else {
    raf(() => callback(el));
  }
};

/**
 * This functions checks if a Stencil component is using
 * the lazy loaded build of Stencil. Returns `true` if
 * the component is lazy loaded. Returns `false` otherwise.
 */
export const hasLazyBuild = (stencilEl: HTMLElement) => {
  return (stencilEl as any).componentOnReady !== undefined;
};

export type Attributes = { [key: string]: any };

/**
 * Elements inside of web components sometimes need to inherit global attributes
 * set on the host. For example, the inner input in `ion-input` should inherit
 * the `title` attribute that developers set directly on `ion-input`. This
 * helper function should be called in componentWillLoad and assigned to a variable
 * that is later used in the render function.
 *
 * This does not need to be reactive as changing attributes on the host element
 * does not trigger a re-render.
 */
export const inheritAttributes = (el: HTMLElement, attributes: string[] = []) => {
  const attributeObject: Attributes = {};

  attributes.forEach((attr) => {
    if (el.hasAttribute(attr)) {
      const value = el.getAttribute(attr);
      if (value !== null) {
        attributeObject[attr] = el.getAttribute(attr);
      }
      el.removeAttribute(attr);
    }
  });

  return attributeObject;
};

/**
 * List of available ARIA attributes + `role`.
 * Removed deprecated attributes.
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes
 */
const ariaAttributes = [
  'role',
  'aria-activedescendant',
  'aria-atomic',
  'aria-autocomplete',
  'aria-braillelabel',
  'aria-brailleroledescription',
  'aria-busy',
  'aria-checked',
  'aria-colcount',
  'aria-colindex',
  'aria-colindextext',
  'aria-colspan',
  'aria-controls',
  'aria-current',
  'aria-describedby',
  'aria-description',
  'aria-details',
  'aria-disabled',
  'aria-errormessage',
  'aria-expanded',
  'aria-flowto',
  'aria-haspopup',
  'aria-hidden',
  'aria-invalid',
  'aria-keyshortcuts',
  'aria-label',
  'aria-labelledby',
  'aria-level',
  'aria-live',
  'aria-multiline',
  'aria-multiselectable',
  'aria-orientation',
  'aria-owns',
  'aria-placeholder',
  'aria-posinset',
  'aria-pressed',
  'aria-readonly',
  'aria-relevant',
  'aria-required',
  'aria-roledescription',
  'aria-rowcount',
  'aria-rowindex',
  'aria-rowindextext',
  'aria-rowspan',
  'aria-selected',
  'aria-setsize',
  'aria-sort',
  'aria-valuemax',
  'aria-valuemin',
  'aria-valuenow',
  'aria-valuetext',
];

/**
 * Returns an array of aria attributes that should be copied from
 * the shadow host element to a target within the light DOM.
 * @param el The element that the attributes should be copied from.
 * @param ignoreList The list of aria-attributes to ignore reflecting and removing from the host.
 * Use this in instances where we manually specify aria attributes on the `<Host>` element.
 */
export const inheritAriaAttributes = (el: HTMLElement, ignoreList?: string[]) => {
  let attributesToInherit = ariaAttributes;
  if (ignoreList && ignoreList.length > 0) {
    attributesToInherit = attributesToInherit.filter((attr) => !ignoreList.includes(attr));
  }
  return inheritAttributes(el, attributesToInherit);
};

export const addEventListener = (el: any, eventName: string, callback: any, opts?: any) => {
  if (typeof (window as any) !== 'undefined') {
    const win = window as any;
    const config = win?.Ionic?.config;
    if (config) {
      const ael = config.get('_ael');
      if (ael) {
        return ael(el, eventName, callback, opts);
      } else if (config._ael) {
        return config._ael(el, eventName, callback, opts);
      }
    }
  }

  return el.addEventListener(eventName, callback, opts);
};

export const removeEventListener = (el: any, eventName: string, callback: any, opts?: any) => {
  if (typeof (window as any) !== 'undefined') {
    const win = window as any;
    const config = win?.Ionic?.config;
    if (config) {
      const rel = config.get('_rel');
      if (rel) {
        return rel(el, eventName, callback, opts);
      } else if (config._rel) {
        return config._rel(el, eventName, callback, opts);
      }
    }
  }

  return el.removeEventListener(eventName, callback, opts);
};

/**
 * Gets the root context of a shadow dom element
 * On newer browsers this will be the shadowRoot,
 * but for older browser this may just be the
 * element itself.
 *
 * Useful for whenever you need to explicitly
 * do "myElement.shadowRoot!.querySelector(...)".
 */
export const getElementRoot = (el: HTMLElement, fallback: HTMLElement = el) => {
  return el.shadowRoot || fallback;
};

/**
 * Patched version of requestAnimationFrame that avoids ngzone
 * Use only when you know ngzone should not run
 */
export const raf = (h: FrameRequestCallback) => {
  if (typeof __zone_symbol__requestAnimationFrame === 'function') {
    return __zone_symbol__requestAnimationFrame(h);
  }
  if (typeof requestAnimationFrame === 'function') {
    return requestAnimationFrame(h);
  }
  return setTimeout(h);
};

export const hasShadowDom = (el: HTMLElement) => {
  return !!el.shadowRoot && !!(el as any).attachShadow;
};

export const focusVisibleElement = (el: HTMLElement) => {
  el.focus();

  /**
   * When programmatically focusing an element,
   * the focus-visible utility will not run because
   * it is expecting a keyboard event to have triggered this;
   * however, there are times when we need to manually control
   * this behavior so we call the `setFocus` method on ion-app
   * which will let us explicitly set the elements to focus.
   */
  if (el.classList.contains('ion-focusable')) {
    const app = el.closest('ion-app');
    if (app) {
      app.setFocus([el]);
    }
  }
};

/**
 * This method is used to add a hidden input to a host element that contains
 * a Shadow DOM. It does not add the input inside of the Shadow root which
 * allows it to be picked up inside of forms. It should contain the same
 * values as the host element.
 *
 * @param always Add a hidden input even if the container does not use Shadow
 * @param container The element where the input will be added
 * @param name The name of the input
 * @param value The value of the input
 * @param disabled If true, the input is disabled
 */
export const renderHiddenInput = (
  always: boolean,
  container: HTMLElement,
  name: string,
  value: string | undefined | null,
  disabled: boolean
) => {
  if (always || hasShadowDom(container)) {
    let input = container.querySelector('input.aux-input') as HTMLInputElement | null;
    if (!input) {
      input = container.ownerDocument!.createElement('input');
      input.type = 'hidden';
      input.classList.add('aux-input');
      container.appendChild(input);
    }
    input.disabled = disabled;
    input.name = name;
    input.value = value || '';
  }
};

export const clamp = (min: number, n: number, max: number) => {
  return Math.max(min, Math.min(n, max));
};

export const assert = (actual: any, reason: string) => {
  if (!actual) {
    const message = 'ASSERT: ' + reason;
    console.error(message);
    debugger; // eslint-disable-line
    throw new Error(message);
  }
};

export const now = (ev: UIEvent) => {
  return ev.timeStamp || Date.now();
};

export const pointerCoord = (ev: any): { x: number; y: number } => {
  // get X coordinates for either a mouse click
  // or a touch depending on the given event
  if (ev) {
    const changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      const touch = changedTouches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    if (ev.pageX !== undefined) {
      return { x: ev.pageX, y: ev.pageY };
    }
  }
  return { x: 0, y: 0 };
};

/**
 * @hidden
 * Given a side, return if it should be on the end
 * based on the value of dir
 * @param side the side
 * @param isRTL whether the application dir is rtl
 */
export const isEndSide = (side: Side): boolean => {
  const isRTL = document.dir === 'rtl';
  switch (side) {
    case 'start':
      return isRTL;
    case 'end':
      return !isRTL;
    default:
      throw new Error(`"${side}" is not a valid value for [side]. Use "start" or "end" instead.`);
  }
};

export const deferEvent = (event: EventEmitter): EventEmitter => {
  return debounceEvent(event, 0);
};

export const debounceEvent = (event: EventEmitter, wait: number): EventEmitter => {
  const original = (event as any)._original || event;
  return {
    _original: event,
    emit: debounce(original.emit.bind(original), wait),
  } as EventEmitter;
};

export const debounce = (func: (...args: any[]) => void, wait = 0) => {
  let timer: any;
  return (...args: any[]): any => {
    clearTimeout(timer);
    timer = setTimeout(func, wait, ...args);
  };
};

/**
 * Check whether the two string maps are shallow equal.
 *
 * undefined is treated as an empty map.
 *
 * @returns whether the keys are the same and the values are shallow equal.
 */
export const shallowEqualStringMap = (
  map1: { [k: string]: any } | undefined,
  map2: { [k: string]: any } | undefined
): boolean => {
  map1 ??= {};
  map2 ??= {};

  if (map1 === map2) {
    return true;
  }

  const keys1 = Object.keys(map1);

  if (keys1.length !== Object.keys(map2).length) {
    return false;
  }

  for (const k1 of keys1) {
    if (!(k1 in map2)) {
      return false;
    }
    if (map1[k1] !== map2[k1]) {
      return false;
    }
  }

  return true;
};

import { doc } from '@utils/browser';

import type { Config } from '../../interface';
import { now, pointerCoord } from '../helpers';

export const startTapClick = (config: Config) => {
  if (doc === undefined) {
    return;
  }

  let lastTouch = -MOUSE_WAIT * 10;
  let lastActivated = 0;

  let activatableEle: HTMLElement | undefined;
  let activeRipple: Promise<() => void> | undefined;
  let activeDefer: ReturnType<typeof setTimeout> | undefined;

  const useRippleEffect = config.getBoolean('animated', true) && config.getBoolean('rippleEffect', true);
  const clearDefers = new WeakMap<HTMLElement, any>();

  // Touch Events
  const onTouchStart = (ev: TouchEvent) => {
    lastTouch = now(ev);
    pointerDown(ev);
  };

  const onTouchEnd = (ev: TouchEvent) => {
    lastTouch = now(ev);
    pointerUp(ev);
  };

  const onMouseDown = (ev: MouseEvent) => {
    // Ignore right clicks
    if (ev.button === 2) {
      return;
    }

    const t = now(ev) - MOUSE_WAIT;
    if (lastTouch < t) {
      pointerDown(ev);
    }
  };

  const onMouseUp = (ev: MouseEvent) => {
    const t = now(ev) - MOUSE_WAIT;
    if (lastTouch < t) {
      pointerUp(ev);
    }
  };

  const cancelActive = () => {
    if (activeDefer) clearTimeout(activeDefer);
    activeDefer = undefined;
    if (activatableEle) {
      removeActivated(false);
      activatableEle = undefined;
    }
  };

  const pointerDown = (ev: UIEvent) => {
    if (activatableEle) {
      return;
    }
    setActivatedElement(getActivatableTarget(ev), ev);
  };

  const pointerUp = (ev: UIEvent) => {
    setActivatedElement(undefined, ev);
  };

  const setActivatedElement = (el: HTMLElement | undefined, ev: UIEvent) => {
    // do nothing
    if (el && el === activatableEle) {
      return;
    }
    if (activeDefer) clearTimeout(activeDefer);
    activeDefer = undefined;

    const { x, y } = pointerCoord(ev);

    // deactivate selected
    if (activatableEle) {
      if (clearDefers.has(activatableEle)) {
        throw new Error('internal error');
      }
      if (!activatableEle.classList.contains(ACTIVATED)) {
        addActivated(activatableEle, x, y);
      }
      removeActivated(true);
    }

    // activate
    if (el) {
      const deferId = clearDefers.get(el);
      if (deferId) {
        clearTimeout(deferId);
        clearDefers.delete(el);
      }

      el.classList.remove(ACTIVATED);
      const callback = () => {
        addActivated(el, x, y);
        activeDefer = undefined;
      };

      if (isInstant(el)) {
        callback();
      } else {
        activeDefer = setTimeout(callback, ADD_ACTIVATED_DEFERS);
      }
    }
    activatableEle = el;
  };

  const addActivated = (el: HTMLElement, x: number, y: number) => {
    lastActivated = Date.now();
    el.classList.add(ACTIVATED);
    if (!useRippleEffect) return;

    const rippleEffect = getRippleEffect(el);
    if (rippleEffect !== null) {
      removeRipple();
      activeRipple = rippleEffect.addRipple(x, y);
    }
  };

  const removeRipple = () => {
    if (activeRipple !== undefined) {
      activeRipple.then((remove) => remove());
      activeRipple = undefined;
    }
  };

  const removeActivated = (smooth: boolean) => {
    removeRipple();
    const active = activatableEle;
    if (!active) {
      return;
    }
    const time = CLEAR_STATE_DEFERS - Date.now() + lastActivated;
    if (smooth && time > 0 && !isInstant(active)) {
      const deferId = setTimeout(() => {
        active.classList.remove(ACTIVATED);
        clearDefers.delete(active);
      }, CLEAR_STATE_DEFERS);
      clearDefers.set(active, deferId);
    } else {
      active.classList.remove(ACTIVATED);
    }
  };

  doc.addEventListener('ionGestureCaptured', cancelActive);

  doc.addEventListener('touchstart', onTouchStart, true);
  doc.addEventListener('touchcancel', onTouchEnd, true);
  doc.addEventListener('touchend', onTouchEnd, true);

  /**
   * Tap click effects such as the ripple effect should
   * not happen when scrolling. For example, if a user scrolls
   * the page but also happens to do a touchstart on a button
   * as part of the scroll, the ripple effect should not
   * be dispatched. The ripple effect should only happen
   * if the button is activated and the page is not scrolling.
   *
   * pointercancel is dispatched on a gesture when scrolling
   * starts, so this lets us avoid having to listen for
   * ion-content's scroll events.
   */
  doc.addEventListener('pointercancel', cancelActive, true);

  doc.addEventListener('mousedown', onMouseDown, true);
  doc.addEventListener('mouseup', onMouseUp, true);
};

// TODO(FW-2832): type
const getActivatableTarget = (ev: UIEvent): any => {
  if (ev.composedPath !== undefined) {
    /**
     * composedPath returns EventTarget[]. However,
     * objects other than Element can be targets too.
     * For example, AudioContext can be a target. In this
     * case, we know that the event is a UIEvent so we
     * can assume that the path will contain either Element
     * or ShadowRoot.
     */
    const path = ev.composedPath() as Element[] | ShadowRoot[];
    for (let i = 0; i < path.length - 2; i++) {
      const el = path[i];
      if (!(el instanceof ShadowRoot) && el.classList.contains('ion-activatable')) {
        return el;
      }
    }
  } else {
    return (ev.target as Element).closest('.ion-activatable');
  }
};

const isInstant = (el: HTMLElement) => {
  return el.classList.contains('ion-activatable-instant');
};

const getRippleEffect = (el: HTMLElement) => {
  if (el.shadowRoot) {
    const ripple = el.shadowRoot.querySelector('ion-ripple-effect');
    if (ripple) {
      return ripple;
    }
  }
  return el.querySelector('ion-ripple-effect');
};

const ACTIVATED = 'ion-activated';
const ADD_ACTIVATED_DEFERS = 100;
const CLEAR_STATE_DEFERS = 150;
const MOUSE_WAIT = 2500;


import { now, pointerCoord } from './helpers';

export function startTapClick(doc: Document) {
  let lastTouch = -MOUSE_WAIT * 10;
  let lastActivated = 0;
  let cancelled = false;

  let activatableEle: HTMLElement | undefined;
  let activeDefer: any;

  const clearDefers = new WeakMap<HTMLElement, any>();

  function onBodyClick(ev: Event) {
    if (cancelled) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  // Touch Events
  function onTouchStart(ev: TouchEvent) {
    lastTouch = now(ev);
    pointerDown(ev);
  }

  function onTouchEnd(ev: TouchEvent) {
    lastTouch = now(ev);
    pointerUp(ev);
  }

  function onMouseDown(ev: MouseEvent) {
    const t = now(ev) - MOUSE_WAIT;
    if (lastTouch < t) {
      pointerDown(ev);
    }
  }

  function onMouseUp(ev: MouseEvent) {
    const t = now(ev) - MOUSE_WAIT;
    if (lastTouch < t) {
      pointerUp(ev);
    }
  }

  function cancelActive() {
    clearTimeout(activeDefer);
    if (activatableEle) {
      removeActivated(false);
      activatableEle = undefined;
    }
    cancelled = true;
  }

  function pointerDown(ev: any) {
    if (activatableEle) {
      return;
    }
    cancelled = false;
    setActivatedElement(getActivatableTarget(ev.target), ev);
  }

  function pointerUp(ev: UIEvent) {
    setActivatedElement(undefined, ev);
    if (cancelled && ev.cancelable) {
      ev.preventDefault();
    }
  }

  function setActivatedElement(el: HTMLElement | undefined, ev: UIEvent) {
    // do nothing
    if (el && el === activatableEle) {
      return;
    }
    clearTimeout(activeDefer);
    activeDefer = undefined;

    const { x, y } = pointerCoord(ev);

    // unactivate selected
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
      activeDefer = setTimeout(() => {
        addActivated(el, x, y);
        activeDefer = undefined;
      }, ADD_ACTIVATED_DEFERS);
    }
    activatableEle = el;
  }

  function addActivated(el: HTMLElement, x: number, y: number) {
    lastActivated = Date.now();
    el.classList.add(ACTIVATED);

    const event = new CustomEvent('ionActivated', {
      bubbles: false,
      detail: { x, y }
    });
    el.dispatchEvent(event);
  }

  function removeActivated(smooth: boolean) {
    const active = activatableEle;
    if (!active) {
      return;
    }
    const time = CLEAR_STATE_DEFERS - Date.now() + lastActivated;
    if (smooth && time > 0) {
      const deferId = setTimeout(() => {
        active.classList.remove(ACTIVATED);
        clearDefers.delete(active);
      }, CLEAR_STATE_DEFERS);
      clearDefers.set(active, deferId);
    } else {
      active.classList.remove(ACTIVATED);
    }
  }

  doc.body.addEventListener('click', onBodyClick, true);
  doc.body.addEventListener('ionScrollStart', cancelActive);
  doc.body.addEventListener('ionGestureCaptured', cancelActive);

  doc.addEventListener('touchstart', onTouchStart, true);
  doc.addEventListener('touchcancel', onTouchEnd, true);
  doc.addEventListener('touchend', onTouchEnd, true);

  doc.addEventListener('mousedown', onMouseDown, true);
  doc.addEventListener('mouseup', onMouseUp, true);
}

function getActivatableTarget(el: HTMLElement): any {
  return el.closest(':not([tappable]) > a, :not([tappable]) > button, [tappable]');
}

const ACTIVATED = 'activated';
const ADD_ACTIVATED_DEFERS = 200;
const CLEAR_STATE_DEFERS = 200;
const MOUSE_WAIT = 2500;

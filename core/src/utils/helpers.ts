import { EventEmitter } from '@stencil/core';

import { Side } from '../interface';

export function rIC(callback: () => void) {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback);
  } else {
    setTimeout(callback, 32);
  }
}

export function hasShadowDom(el: HTMLElement) {
  return !!el.shadowRoot && !!(el as any).attachShadow;
}

export function findItemLabel(componentEl: HTMLElement) {
  const itemEl = componentEl.closest('ion-item');
  if (itemEl) {
    return itemEl.querySelector('ion-label');
  }
  return null;
}

export function renderHiddenInput(always: boolean, container: HTMLElement, name: string, value: string | undefined | null, disabled: boolean) {
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
}

export function clamp(min: number, n: number, max: number) {
  return Math.max(min, Math.min(n, max));
}

export function assert(actual: any, reason: string) {
  if (!actual) {
    const message = 'ASSERT: ' + reason;
    console.error(message);
    debugger; // tslint:disable-line
    throw new Error(message);
  }
}

export function now(ev: UIEvent) {
  return ev.timeStamp || Date.now();
}

export function pointerCoord(ev: any): {x: number, y: number} {
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
}

/**
 * @hidden
 * Given a side, return if it should be on the end
 * based on the value of dir
 * @param side the side
 * @param isRTL whether the application dir is rtl
 */
export function isEndSide(win: Window, side: Side): boolean {
  const isRTL = win.document.dir === 'rtl';
  switch (side) {
    case 'start': return isRTL;
    case 'end': return !isRTL;
    default:
      throw new Error(`"${side}" is not a valid value for [side]. Use "start" or "end" instead.`);
  }
}

export function deferEvent(event: EventEmitter): EventEmitter {
  return debounceEvent(event, 0);
}

export function debounceEvent(event: EventEmitter, wait: number): EventEmitter {
  const original = (event as any)._original || event;
  return {
    _original: event,
    emit: debounce(original.emit.bind(original), wait)
  } as EventEmitter;
}

export function debounce(func: (...args: any[]) => void, wait = 0) {
  let timer: any;
  return (...args: any[]): any => {
    clearTimeout(timer);
    timer = setTimeout(func, wait, ...args);
  };
}

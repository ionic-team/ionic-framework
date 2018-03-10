import { EventEmitter } from '@stencil/core';

export function clamp(min: number, n: number, max: number) {
  return Math.max(min, Math.min(n, max));
}

export function isDef(v: any): boolean { return v !== undefined && v !== null; }

export function assert(actual: any, reason: string) {
  if (!actual) {
    const message = 'ASSERT: ' + reason;
    console.error(message);
    debugger; // tslint:disable-line
    throw new Error(message);
  }
}

export function autoFocus(containerEl: HTMLElement): HTMLElement|null {
  const focusableEls = containerEl.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]');
  if (focusableEls.length > 0) {
    const el = focusableEls[0] as HTMLInputElement;
    el.focus();
    return el;
  }
  return null;
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
      return {x: touch.clientX, y: touch.clientY};
    }
    if (ev.pageX !== undefined) {
      return {x: ev.pageX, y: ev.pageY};
    }
  }
  return {x: 0, y: 0};
}
export type Side = 'left' | 'right' | 'start' | 'end';

/**
 * @hidden
 * Given a side, return if it should be on the right
 * based on the value of dir
 * @param side the side
 * @param isRTL whether the application dir is rtl
 * @param defaultRight whether the default side is right
 */
export function isRightSide(side: Side, defaultRight = false): boolean {
  const isRTL = document.dir === 'rtl';
  switch (side) {
    case 'right': return true;
    case 'left': return false;
    case 'end': return !isRTL;
    case 'start': return isRTL;
    default: return defaultRight ? !isRTL : isRTL;
  }
}

export function domControllerAsync(domControllerFunction: Function, callback?: Function): Promise<any> {
  return new Promise((resolve) => {
    domControllerFunction(() => {
      if (!callback) {
        return resolve();
      }
      Promise.resolve(callback()).then((...args: any[]) => {
        resolve(args);
      });
    });
  });
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

export function debounce(func: Function, wait = 0) {
  let timer: number;
  return (...args: any[]): void => {
    clearTimeout(timer);
    timer = setTimeout(func, wait, ...args);
  };
}

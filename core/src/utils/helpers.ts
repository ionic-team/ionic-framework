import { EventEmitter } from '@stencil/core';

export function reorderArray(array: any[], indexes: {from: number, to: number}): any[] {
  const element = array[indexes.from];
  array.splice(indexes.from, 1);
  array.splice(indexes.to, 0, element);
  return array;
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
      return {x: touch.clientX, y: touch.clientY};
    }
    if (ev.pageX !== undefined) {
      return {x: ev.pageX, y: ev.pageY};
    }
  }
  return {x: 0, y: 0};
}
export type Side = 'start' | 'end';

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

export function debounce(func: Function, wait = 0) {
  let timer: number;
  return (...args: any[]): void => {
    clearTimeout(timer);
    timer = setTimeout(func, wait, ...args);
  };
}

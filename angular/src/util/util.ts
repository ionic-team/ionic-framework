import { ElementRef } from '@angular/core';
import { Subject } from 'rxjs';

export function inputs(instance: any, el: ElementRef, props: string[]) {
  props.forEach(propName => {
    Object.defineProperty(instance, propName, {
      get: () => el.nativeElement[propName], set: (val: any) => el.nativeElement[propName] = val
    });
  });
}

export function proxyEvent<T>(emitter: Subject<T>, el: EventTarget, eventName: string) {
  el.addEventListener(eventName, ev => {
    emitter.next((ev as any).detail as T);
  });
}

export function proxyMethod(ctrlName: string, methodName: string, ...args: any[]) {
  const controller = ensureElementInBody(ctrlName);
  return controller.componentOnReady()
    .then(() => (controller as any)[methodName].apply(controller, args));
}

export function ensureElementInBody(elementName: string) {
  let element = document.querySelector(elementName);
  if (!element) {
    element = document.createElement(elementName);
    document.body.appendChild(element);
  }
  return element as HTMLStencilElement;
}

export function deepEqual(x: any, y: any) {
  if (x === y) {
    return true;
  } else if (typeof x === 'object' && x != null && (typeof y === 'object' && y != null)) {
    if (Object.keys(x).length !== Object.keys(y).length) { return false; }

    for (const prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop])) { return false; }
      } else { return false; }
    }

    return true;
  } else { return false; }
}

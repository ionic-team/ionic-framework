import { ElementRef } from '@angular/core';

export function proxyMethod(ctrlName: string, methodName: string, ...args: any[]) {
  const controller = ensureElementInBody(ctrlName);
  return controller.componentOnReady()
    .then(() => (controller as any)[methodName].apply(controller, args));
}

export function proxyEl(ref: ElementRef, methodName: string, ...args: any[]) {
  return ref.nativeElement.componentOnReady()
    .then((el: any) => el[methodName].apply(el, args));
}


export function ensureElementInBody(elementName: string) {
  let element = document.querySelector(elementName);
  if (!element) {
    element = document.createElement(elementName);
    document.body.appendChild(element);
  }
  return element as HTMLStencilElement;
}

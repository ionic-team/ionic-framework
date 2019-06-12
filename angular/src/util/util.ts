import { HTMLStencilElement } from '../types/interfaces';

export function proxyMethod(ctrlName: string, doc: Document, methodName: string, ...args: any[]) {
  const controller = ensureElementInBody(ctrlName, doc);
  return controller.componentOnReady()
    .then(() => (controller as any)[methodName].apply(controller, args));
}

export function ensureElementInBody(elementName: string, doc: Document) {
  let element = doc.querySelector(elementName);
  if (!element) {
    element = doc.createElement(elementName);
    doc.body.appendChild(element);
  }
  return element as HTMLStencilElement;
}

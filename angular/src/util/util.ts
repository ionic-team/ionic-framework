import { HTMLStencilElement } from '../types/interfaces';

declare const __zone_symbol__requestAnimationFrame: any;
declare const requestAnimationFrame: any;

export const raf = (h: any) => {
  if (typeof __zone_symbol__requestAnimationFrame === 'function') {
    return __zone_symbol__requestAnimationFrame(h);
  }
  if (typeof requestAnimationFrame === 'function') {
    return requestAnimationFrame(h);
  }
  return setTimeout(h);
};

export const proxyMethod = (ctrlName: string, doc: Document, methodName: string, ...args: any[]) => {
  const controller = ensureElementInBody(ctrlName, doc);
  return controller.componentOnReady()
    .then(() => (controller as any)[methodName].apply(controller, args));
};

export const ensureElementInBody = (elementName: string, doc: Document) => {
  let element = doc.querySelector(elementName);
  if (!element) {
    element = doc.createElement(elementName);
    doc.body.appendChild(element);
  }
  return element as HTMLStencilElement;
};

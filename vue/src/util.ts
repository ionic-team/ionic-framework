import { HTMLStencilElement } from '@ionic/core';

export class OverlayBaseController<Opts, Overlay> {
  constructor(private ctrl: string) {}

  create(opts?: Opts): Promise<Overlay> {
    return proxyMethod(this.ctrl, 'create', opts);
  }

  dismiss(data?: any, role?: string, id?: string): Promise<void> {
    return proxyMethod(this.ctrl, 'dismiss', data, role, id);
  }

  getTop(): Promise<Overlay> {
    return proxyMethod(this.ctrl, 'getTop');
  }
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

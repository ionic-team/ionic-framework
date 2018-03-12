import { Injectable } from '@angular/core';
import { ToastDismissEvent, ToastOptions } from '@ionic/core';

import { ensureElementInBody, hydrateElement } from '../util/util';

let toastId = 0;

@Injectable()
export class ToastController {
  create(opts?: ToastOptions): ToastProxy {
    return getToastProxy(opts);
  }
}

export function getToastProxy(opts: ToastOptions) {
  return {
    id: toastId++,
    state: PRESENTING,
    opts: opts,
    present: function() { return present(this); },
    dismiss: function() { return dismiss(this); },
    onDidDismiss: function(callback: (data: any, role: string) => void) {
      (this as ToastProxyInternal).onDidDismissHandler = callback;
    },
    onWillDismiss: function(callback: (data: any, role: string) => void) {
      (this as ToastProxyInternal).onWillDismissHandler = callback;
    },
  };
}

export function present(toastProxy: ToastProxyInternal): Promise<any> {
  toastProxy.state = PRESENTING;
  return loadOverlay(toastProxy.opts).then((toastElement: HTMLIonToastElement) => {
    toastProxy.element = toastElement;

    const onDidDismissHandler = (event: ToastDismissEvent) => {
      toastElement.removeEventListener(ION_TOAST_DID_DISMISS_EVENT, onDidDismissHandler);
      if (toastProxy.onDidDismissHandler) {
        toastProxy.onDidDismissHandler(event.detail.data, event.detail.role);
      }
    };

    const onWillDismissHandler = (event: ToastDismissEvent) => {
      toastElement.removeEventListener(ION_TOAST_WILL_DISMISS_EVENT, onWillDismissHandler);
      if (toastProxy.onWillDismissHandler) {
        toastProxy.onWillDismissHandler(event.detail.data, event.detail.role);
      }
    };

    toastElement.addEventListener(ION_TOAST_DID_DISMISS_EVENT, onDidDismissHandler);
    toastElement.addEventListener(ION_TOAST_WILL_DISMISS_EVENT, onWillDismissHandler);

    if (toastProxy.state === PRESENTING) {
      return toastElement.present();
    }

    // we'll only ever get here if someone tried to dismiss the overlay or mess with it's internal state
    // attribute before it could async load and present itself.
    // with that in mind, just return null to make the TS compiler happy
    return null;
  });
}

export function dismiss(toastProxy: ToastProxyInternal): Promise<any> {
  toastProxy.state = DISMISSING;
  if (toastProxy.element) {
    if (toastProxy.state === DISMISSING) {
      return toastProxy.element.dismiss();
    }
  }
  // either we're not in the dismissing state
  // or we're calling this before the element is created
  // so just return a resolved promise
  return Promise.resolve();
}

export function loadOverlay(opts: ToastOptions): Promise<HTMLIonToastElement> {
  const element = ensureElementInBody('ion-toast-controller') as HTMLIonToastControllerElement;
  return hydrateElement(element).then(() => {
    return element.create(opts);
  });
}

export interface ToastProxy {
  present(): Promise<void>;
  dismiss(): Promise<void>;
  onDidDismiss(callback: (data: any, role: string) => void): void;
  onWillDismiss(callback: (data: any, role: string) => void): void;
}

export interface ToastProxyInternal extends ToastProxy {
  id: number;
  opts: ToastOptions;
  state: number;
  element: HTMLIonToastElement;
  onDidDismissHandler?: (data: any, role: string) => void;
  onWillDismissHandler?: (data: any, role: string) => void;
}

export const PRESENTING = 1;
export const DISMISSING = 2;

const ION_TOAST_DID_DISMISS_EVENT = 'ionToastDidDismiss';
const ION_TOAST_WILL_DISMISS_EVENT = 'ionToastWillDismiss';

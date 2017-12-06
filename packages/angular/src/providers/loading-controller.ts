import { Injectable } from '@angular/core';
import { LoadingDismissEvent, LoadingOptions } from '@ionic/core';

import { ensureElementInBody, hydrateElement } from '../util/util';

let loadingId = 0;

@Injectable()
export class LoadingController {
  create(opts?: LoadingOptions): LoadingProxy {
    return getLoadingProxy(opts);
  }
}

export function getLoadingProxy(opts: LoadingOptions){
  return {
    id: loadingId++,
    state: PRESENTING,
    opts: opts,
    present: function() { return present(this)},
    dismiss: function() { return dismiss(this)},
    onDidDismiss: function(callback: (data: any, role: string) => void) {
      (this as LoadingProxyInternal).onDidDismissHandler = callback;
    },
    onWillDismiss: function(callback: (data: any, role: string) => void) {
      (this as LoadingProxyInternal).onWillDismissHandler = callback;
    },
  }
}

export function present(loadingProxy: LoadingProxyInternal): Promise<any> {
  loadingProxy.state = PRESENTING;
  return loadOverlay(loadingProxy.opts).then((loadingElement: HTMLIonLoadingElement) => {
    loadingProxy.element = loadingElement;

    const onDidDismissHandler = (event: LoadingDismissEvent) => {
      loadingElement.removeEventListener(ION_LOADING_DID_DISMISS_EVENT, onDidDismissHandler);
      if (loadingProxy.onDidDismissHandler) {
        loadingProxy.onDidDismissHandler(event.detail.data, event.detail.role);
      }
    };

    const onWillDismissHandler = (event: LoadingDismissEvent) => {
      loadingElement.removeEventListener(ION_LOADING_WILL_DISMISS_EVENT, onWillDismissHandler);
      if (loadingProxy.onWillDismissHandler) {
        loadingProxy.onWillDismissHandler(event.detail.data, event.detail.role);
      }
    };

    loadingElement.addEventListener(ION_LOADING_DID_DISMISS_EVENT, onDidDismissHandler);
    loadingElement.addEventListener(ION_LOADING_WILL_DISMISS_EVENT, onWillDismissHandler);

    if (loadingProxy.state === PRESENTING) {
      return loadingElement.present();
    }

    // we'll only ever get here if someone tried to dismiss the overlay or mess with it's internal state
    // attribute before it could async load and present itself.
    // with that in mind, just return null to make the TS compiler happy
    return null;
  });
}

export function dismiss(loadingProxy: LoadingProxyInternal): Promise<any> {
  loadingProxy.state = DISMISSING;
  if (loadingProxy.element) {
    if (loadingProxy.state === DISMISSING) {
      return loadingProxy.element.dismiss();
    }
  }
  // either we're not in the dismissing state
  // or we're calling this before the element is created
  // so just return a resolved promise
  return Promise.resolve();
}

export function loadOverlay(opts: LoadingOptions): Promise<HTMLIonLoadingElement> {
  const element = ensureElementInBody('ion-loading-controller') as HTMLIonLoadingControllerElement;
  return hydrateElement(element).then(() => {
    return element.create(opts);
  });
}

export interface LoadingProxy {
  present(): Promise<void>
  dismiss(): Promise<void>
  onDidDismiss(callback: (data: any, role: string) => void): void;
  onWillDismiss(callback: (data: any, role: string) => void): void;
}

export interface LoadingProxyInternal extends LoadingProxy {
  id: number;
  opts: LoadingOptions;
  state: number;
  element: HTMLIonLoadingElement;
  onDidDismissHandler?: (data: any, role: string) => void;
  onWillDismissHandler?: (data: any, role: string) => void;
}

export const PRESENTING = 1;
export const DISMISSING = 2;

const ION_LOADING_DID_DISMISS_EVENT = 'ionLoadingDidDismiss';
const ION_LOADING_WILL_DISMISS_EVENT = 'ionLoadingWillDismiss';
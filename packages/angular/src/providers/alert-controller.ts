import { Injectable } from '@angular/core';
import { AlertDismissEvent, AlertOptions } from '@ionic/core';

import { ensureElementInBody, hydrateElement } from '../util/util';

let alertId = 0;

@Injectable()
export class AlertController {
  create(opts?: AlertOptions): AlertProxy {
    return getAlertProxy(opts);
  }
}

export function getAlertProxy(opts: AlertOptions){
  return {
    id: alertId++,
    state: PRESENTING,
    opts: opts,
    present: function() { return present(this)},
    dismiss: function() { return dismiss(this)},
    onDidDismiss: function(callback: (data: any, role: string) => void) {
      (this as AlertProxyInternal).onDidDismissHandler = callback;
    },
    onWillDismiss: function(callback: (data: any, role: string) => void) {
      (this as AlertProxyInternal).onWillDismissHandler = callback;
    },
  }
}

export function present(alertProxy: AlertProxyInternal): Promise<any> {
  alertProxy.state = PRESENTING;
  return loadOverlay(alertProxy.opts).then((alertElement: HTMLIonAlertElement) => {
    alertProxy.element = alertElement;

    const onDidDismissHandler = (event: AlertDismissEvent) => {
      alertElement.removeEventListener(ION_ALERT_DID_DISMISS_EVENT, onDidDismissHandler);
      if (alertProxy.onDidDismissHandler) {
        alertProxy.onDidDismissHandler(event.detail.data, event.detail.role);
      }
    };

    const onWillDismissHandler = (event: AlertDismissEvent) => {
      alertElement.removeEventListener(ION_ALERT_WILL_DISMISS_EVENT, onWillDismissHandler);
      if (alertProxy.onWillDismissHandler) {
        alertProxy.onWillDismissHandler(event.detail.data, event.detail.role);
      }
    };

    alertElement.addEventListener(ION_ALERT_DID_DISMISS_EVENT, onDidDismissHandler);
    alertElement.addEventListener(ION_ALERT_WILL_DISMISS_EVENT, onWillDismissHandler);

    if (alertProxy.state === PRESENTING) {
      return alertElement.present();
    }

    // we'll only ever get here if someone tried to dismiss the overlay or mess with it's internal state
    // attribute before it could async load and present itself.
    // with that in mind, just return null to make the TS compiler happy
    return null;
  });
}

export function dismiss(alertProxy: AlertProxyInternal): Promise<any> {
  alertProxy.state = DISMISSING;
  if (alertProxy.element) {
    if (alertProxy.state === DISMISSING) {
      return alertProxy.element.dismiss();
    }
  }
  // either we're not in the dismissing state
  // or we're calling this before the element is created
  // so just return a resolved promise
  return Promise.resolve();
}

export function loadOverlay(opts: AlertOptions): Promise<HTMLIonAlertElement> {
  const element = ensureElementInBody('ion-alert-controller') as HTMLIonAlertControllerElement;
  return hydrateElement(element).then(() => {
    return element.create(opts);
  });
}

export interface AlertProxy {
  present(): Promise<void>
  dismiss(): Promise<void>
  onDidDismiss(callback: (data: any, role: string) => void): void;
  onWillDismiss(callback: (data: any, role: string) => void): void;
}

export interface AlertProxyInternal extends AlertProxy {
  id: number;
  opts: AlertOptions;
  state: number;
  element: HTMLIonAlertElement;
  onDidDismissHandler?: (data: any, role: string) => void;
  onWillDismissHandler?: (data: any, role: string) => void;
}

export const PRESENTING = 1;
export const DISMISSING = 2;

const ION_ALERT_DID_DISMISS_EVENT = 'ionAlertDidDismiss';
const ION_ALERT_WILL_DISMISS_EVENT = 'ionAlertWillDismiss';
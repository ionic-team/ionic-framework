import { AlertOptions } from '@ionic/core';

import { ensureElementInBody, hydrateElement } from '../util/util';

let alertId = 0;
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
    dismiss: function() { return dismiss(this)}
  }
}

export function present(alertProxy: AlertProxyInternal): Promise<void> {
  return loadOverlay(alertProxy.opts).then((alertElement: HTMLIonAlertElement) => {
    if (alertProxy.state === PRESENTING) {
      return alertElement.present();
    }
  });
}

export function dismiss(alertProxy: AlertProxyInternal): Promise<void> {
  return loadOverlay(alertProxy.opts).then((alertElement: HTMLIonAlertElement) => {
    if (alertProxy.state === DISMISSING) {
      return alertElement.dismiss();
    }
  });
}

export function loadOverlay(opts: AlertOptions) {
  const element = ensureElementInBody('ion-alert-controller') as HTMLIonAlertControllerElement;
  return hydrateElement(element).then(() => {
    return element.create(opts);
  });
}

export interface AlertProxy {
  present(): Promise<void>
  dismiss(): Promise<void>
}

export interface AlertProxyInternal extends AlertProxy {
  id: number;
  opts: AlertOptions;
  state: number;
}

export const PRESENTING = 1;
export const DISMISSING = 2;
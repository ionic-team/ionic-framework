import { Component, Listen, Method } from '@stencil/core';
import { AlertEvent, AlertOptions } from '../../index';

let ids = 0;
const alerts = new Map<number, HTMLIonAlertElement>();

@Component({
  tag: 'ion-alert-controller'
})
export class AlertController {

  @Method()
  create(opts?: AlertOptions): Promise<HTMLIonAlertElement> {
    // create ionic's wrapping ion-alert component
    const alertElement = document.createElement('ion-alert');

    // give this alert a unique id
    alertElement.alertId = ids++;

    // convert the passed in alert options into props
    // that get passed down into the new alert
    Object.assign(alertElement, opts);

    // append the alert element to the document body
    const appRoot = document.querySelector('ion-app') || document.body;
    appRoot.appendChild(alertElement);

    return (alertElement as any).componentOnReady();
  }

  @Method()
  dismiss(data?: any, role?: any, alertId = -1) {
    alertId = alertId >= 0 ? alertId : getHighestId();
    const alert = alerts.get(alertId);
    if (!alert) {
      return Promise.reject('alert does not exist');
    }
    return alert.dismiss(data, role);
  }


  @Listen('body:ionAlertWillPresent')
  protected alertWillPresent(ev: AlertEvent) {
    alerts.set(ev.target.alertId, ev.target);
  }


  @Listen('body:ionAlertWillDismiss, body:ionAlertDidUnload')
  protected alertWillDismiss(ev: AlertEvent) {
    alerts.delete(ev.target.alertId);
  }


  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    removeLastAlert();
  }
}

function getHighestId() {
  let minimum = -1;
  alerts.forEach((_alert: HTMLIonAlertElement, id: number) => {
    if (id > minimum) {
      minimum = id;
    }
  });
  return minimum;
}

function removeLastAlert() {
  const toRemove = alerts.get(getHighestId());
  return toRemove ? toRemove.dismiss() : Promise.resolve();
}

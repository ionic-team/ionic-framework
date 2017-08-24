import { Component, Listen, Method } from '@stencil/core';
import { Alert, AlertEvent, AlertOptions  } from '../../index';


@Component({
  tag: 'ion-alert-controller'
})
export class AlertController {
  private ids = 0;
  private alertResolves: { [alertId: string]: Function } = {};
  private alerts: Alert[] = [];

  @Method()
  create(opts?: AlertOptions) {
    // create ionic's wrapping ion-alert component
    const alert = document.createElement('ion-alert');

    const id = this.ids++;

    // give this action sheet a unique id
    alert.id = `alert-${id}`;
    alert.style.zIndex = (20000 + id).toString();

    // convert the passed in action sheet options into props
    // that get passed down into the new action sheet
    Object.assign(alert, opts);

    // append the action sheet element to the document body
    const appRoot = document.querySelector('ion-app') || document.body;
    appRoot.appendChild(alert as any);

    // store the resolve function to be called later up when the action sheet loads
    return new Promise<Alert>(resolve => {
      this.alertResolves[alert.id] = resolve;
    });
  }

  @Listen('body:ionAlertDidLoad')
  protected viewDidLoad(ev: AlertEvent) {
    const alert = ev.detail.alert;
    const alertResolve = this.alertResolves[alert.id];
    if (alertResolve) {
      alertResolve(alert);
      delete this.alertResolves[alert.id];
    }
  }

  @Listen('body:ionAlertWillPresent')
  protected willPresent(ev: AlertEvent) {
    this.alerts.push(ev.detail.alert);
  }

  @Listen('body:ionAlertWillDismiss, body:ionAlertDidUnload')
  protected willDismiss(ev: AlertEvent) {
    const index = this.alerts.indexOf(ev.detail.alert);
    if (index > -1) {
      this.alerts.splice(index, 1);
    }
  }

  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    const lastAlert = this.alerts[this.alerts.length - 1];
    if (lastAlert) {
      lastAlert.dismiss();
    }
  }
}

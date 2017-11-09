import { Component, Listen, Method } from '@stencil/core';
import { Alert, AlertOptions, ComponentEvent } from '../../index';


@Component({
  tag: 'ion-alert-controller'
})
export class AlertController {
  private ids = 0;
  private alertResolves: { [alertId: string]: Function } = {};
  private alerts: Alert[] = [];

  @Method()
  create(opts?: AlertOptions): Promise<Alert> {
    // create ionic's wrapping ion-alert component
    const alert = document.createElement('ion-alert');

    const id = this.ids++;

    // give this action sheet a unique id
    alert.alertId = `alert-${id}`;
    alert.style.zIndex = (20000 + id).toString();

    // convert the passed in action sheet options into props
    // that get passed down into the new action sheet
    Object.assign(alert, opts);

    // append the action sheet element to the document body
    const appRoot = document.querySelector('ion-app') || document.body;
    appRoot.appendChild(alert as any);

    // store the resolve function to be called later up when the action sheet loads
    return new Promise<Alert>(resolve => {
      this.alertResolves[alert.alertId] = resolve;
    });
  }

  @Listen('body:ionAlertDidLoad')
  protected viewDidLoad(ev: ComponentEvent<Alert>) {
    const alert = ev.detail.component;
    const alertResolve = this.alertResolves[alert.alertId];
    if (alertResolve) {
      alertResolve(alert);
      delete this.alertResolves[alert.alertId];
    }
  }

  @Listen('body:ionAlertWillPresent')
  protected willPresent(ev: ComponentEvent<Alert>) {
    this.alerts.push(ev.detail.component);
  }

  @Listen('body:ionAlertWillDismiss, body:ionAlertDidUnload')
  protected willDismiss(ev: ComponentEvent<Alert>) {
    const index = this.alerts.indexOf(ev.detail.component);
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

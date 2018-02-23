import { Component, Listen, Method } from '@stencil/core';
import { AlertEvent, AlertOptions, OverlayController } from '../../index';
import { createOverlay, removeLastOverlay, dismissOverlay, getTopOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-alert-controller'
})
export class AlertController implements OverlayController {

  private alerts = new Map<number, HTMLIonAlertElement>();

  @Listen('body:ionAlertWillPresent')
  protected alertWillPresent(ev: AlertEvent) {
    this.alerts.set(ev.target.overlayId, ev.target);
  }

  @Listen('body:ionAlertWillDismiss')
  @Listen('body:ionAlertDidUnload')
  protected alertWillDismiss(ev: AlertEvent) {
    this.alerts.delete(ev.target.overlayId);
  }

  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    removeLastOverlay(this.alerts);
  }

  /*
   * Create an alert overlay with alert options.
   */
  @Method()
  create(opts?: AlertOptions): Promise<HTMLIonAlertElement> {
    return createOverlay('ion-alert', opts);
  }

  /*
   * Dismiss the open alert overlay.
   */
  @Method()
  dismiss(data?: any, role?: string, alertId = -1) {
    return dismissOverlay(data, role, this.alerts, alertId);
  }

  /*
   * Get the most recently opened alert overlay.
   */
  @Method()
  getTop(): HTMLIonAlertElement {
    return getTopOverlay(this.alerts);
  }
}

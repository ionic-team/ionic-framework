import { Component, Listen, Method, Prop } from '@stencil/core';
import { AlertOptions } from '../../interface';
import { OverlayController, createOverlay, dismissOverlay, getTopOverlay, removeLastOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-alert-controller'
})
export class AlertController implements OverlayController {

  private alerts = new Map<number, HTMLIonAlertElement>();

  @Prop({ context: 'document' }) doc!: Document;

  @Listen('body:ionAlertWillPresent')
  protected alertWillPresent(ev: any) {
    this.alerts.set(ev.target.overlayId, ev.target);
  }

  @Listen('body:ionAlertWillDismiss')
  @Listen('body:ionAlertDidUnload')
  protected alertWillDismiss(ev: any) {
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
    return createOverlay(this.doc.createElement('ion-alert'), opts);
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

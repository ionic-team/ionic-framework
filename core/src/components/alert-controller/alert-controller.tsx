import { Component, Method, Prop } from '@stencil/core';

import { AlertOptions, OverlayController } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-alert-controller'
})
export class AlertController implements OverlayController {

  @Prop({ context: 'document' }) doc!: Document;

  /**
   * Create an alert overlay with alert options
   */
  @Method()
  create(opts: AlertOptions): Promise<HTMLIonAlertElement> {
    return createOverlay(this.doc.createElement('ion-alert'), opts);
  }

  /**
   * Dismiss the open alert overlay.
   */
  @Method()
  dismiss(data?: any, role?: string, alertId?: number) {
    return dismissOverlay(this.doc, data, role, 'ion-alert', alertId);
  }

  /**
   * Get the most recently opened alert overlay.
   */
  @Method()
  getTop(): HTMLIonAlertElement {
    return getOverlay(this.doc, 'ion-alert') as HTMLIonAlertElement;
  }
}

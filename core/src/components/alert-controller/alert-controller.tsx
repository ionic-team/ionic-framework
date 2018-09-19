import { Component, ComponentInterface, Method, Prop } from '@stencil/core';

import { AlertOptions, OverlayController } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-alert-controller'
})
export class AlertController implements ComponentInterface, OverlayController {

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
  dismiss(data?: any, role?: string, id?: string) {
    return dismissOverlay(this.doc, data, role, 'ion-alert', id);
  }

  /**
   * Get the most recently opened alert overlay.
   */
  @Method()
  async getTop(): Promise<HTMLIonAlertElement | undefined> {
    return getOverlay(this.doc, 'ion-alert') as HTMLIonAlertElement;
  }
}

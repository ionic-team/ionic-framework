import { Component, ComponentInterface, Method } from '@stencil/core';

import { AlertOptions, OverlayController } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-alert-controller'
})
export class AlertController implements ComponentInterface, OverlayController {

  /**
   * Create an alert overlay with alert options.
   *
   * @param options The options to use to create the alert.
   */
  @Method()
  create(options: AlertOptions): Promise<HTMLIonAlertElement> {
    return createOverlay('ion-alert', options);
  }

  /**
   * Dismiss the open alert overlay.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the alert.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the alert.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   * @param id The id of the alert to dismiss. If an id is not provided, it will dismiss the most recently opened alert.
   */
  @Method()
  dismiss(data?: any, role?: string, id?: string) {
    return dismissOverlay(document, data, role, 'ion-alert', id);
  }

  /**
   * Get the most recently opened alert overlay.
   */
  @Method()
  async getTop(): Promise<HTMLIonAlertElement | undefined> {
    return getOverlay(document, 'ion-alert') as HTMLIonAlertElement;
  }
}

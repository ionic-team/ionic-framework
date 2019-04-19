import { Component, ComponentInterface, Method } from '@stencil/core';

import { OverlayController, ToastOptions } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-toast-controller'
})
export class ToastController implements ComponentInterface, OverlayController {

  /**
   * Create a toast overlay with toast options.
   */
  @Method()
  create(opts?: ToastOptions): Promise<HTMLIonToastElement> {
    return createOverlay(document.createElement('ion-toast'), opts);
  }

  /**
   * Dismiss the open toast overlay.
   */
  @Method()
  dismiss(data?: any, role?: string, id?: string) {
    return dismissOverlay(document, data, role, 'ion-toast', id);
  }

  /**
   * Get the most recently opened toast overlay.
   */
  @Method()
  async getTop(): Promise<HTMLIonToastElement | undefined> {
    return getOverlay(document, 'ion-toast') as HTMLIonToastElement;
  }
}

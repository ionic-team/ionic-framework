import { Component, ComponentInterface, Method } from '@stencil/core';

import { OverlayController, ToastOptions } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-toast-controller'
})
export class ToastController implements ComponentInterface, OverlayController {

  /**
   * Create a toast overlay with toast options.
   *
   * @param options The options to use to create the toast.
   */
  @Method()
  create(options?: ToastOptions): Promise<HTMLIonToastElement> {
    return createOverlay('ion-toast', options);
  }

  /**
   * Dismiss the open toast overlay.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the toast. For example, 'cancel' or 'backdrop'.
   * @param id The id of the toast to dismiss. If an id is not provided, it will dismiss the most recently opened toast.
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

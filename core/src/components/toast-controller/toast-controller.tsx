import { Component, ComponentInterface, Method, Prop } from '@stencil/core';

import { OverlayController, ToastOptions } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-toast-controller'
})
export class ToastController implements ComponentInterface, OverlayController {

  @Prop({ context: 'document' }) doc!: Document;

  /**
   * Create a toast overlay with toast options.
   *
   * @param options The options to use to create the toast.
   */
  @Method()
  create(options?: ToastOptions): Promise<HTMLIonToastElement> {
    return createOverlay(this.doc.createElement('ion-toast'), options);
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
    return dismissOverlay(this.doc, data, role, 'ion-toast', id);
  }

  /**
   * Get the most recently opened toast overlay.
   */
  @Method()
  async getTop(): Promise<HTMLIonToastElement | undefined> {
    return getOverlay(this.doc, 'ion-toast') as HTMLIonToastElement;
  }
}

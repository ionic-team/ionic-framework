import { Component, ComponentInterface, Method, Prop } from '@stencil/core';

import { ComponentRef, ModalOptions, OverlayController } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-modal-controller'
})
export class ModalController implements ComponentInterface, OverlayController {

  @Prop({ context: 'document' }) doc!: Document;

  /**
   * Create a modal overlay with modal options.
   */
  @Method()
  create<T extends ComponentRef>(opts: ModalOptions<T>): Promise<HTMLIonModalElement> {
    return createOverlay(this.doc.createElement('ion-modal'), opts);
  }

  /**
   * Dismiss the open modal overlay.
   */
  @Method()
  dismiss(data?: any, role?: string, id?: string) {
    return dismissOverlay(this.doc, data, role, 'ion-modal', id);
  }

  /**
   * Get the most recently opened modal overlay.
   */
  @Method()
  async getTop(): Promise<HTMLIonModalElement | undefined> {
    return getOverlay(this.doc, 'ion-modal') as HTMLIonModalElement;
  }
}

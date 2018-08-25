import { Component, Method, Prop } from '@stencil/core';

import { ModalOptions, OverlayController } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-modal-controller'
})
export class ModalController implements OverlayController {

  @Prop({ context: 'document' }) doc!: Document;

  /**
   * Create a modal overlay with modal options.
   */
  @Method()
  create(opts?: ModalOptions): Promise<HTMLIonModalElement> {
    return createOverlay(this.doc.createElement('ion-modal'), opts);
  }

  /**
   * Dismiss the open modal overlay.
   */
  @Method()
  dismiss(data?: any, role?: string, modalId?: number) {
    return dismissOverlay(this.doc, data, role, 'ion-modal', modalId);
  }

  /**
   * Get the most recently opened modal overlay.
   */
  @Method()
  getTop(): HTMLIonModalElement {
    return getOverlay(this.doc, 'ion-modal') as HTMLIonModalElement;
  }
}

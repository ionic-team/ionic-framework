import { Component, ComponentInterface, Method } from '@stencil/core';

import { ComponentRef, ModalOptions, OverlayController } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-modal-controller'
})
export class ModalController implements ComponentInterface, OverlayController {

  /**
   * Create a modal overlay with modal options.
   */
  @Method()
  create<T extends ComponentRef>(opts: ModalOptions<T>): Promise<HTMLIonModalElement> {
    return createOverlay(document.createElement('ion-modal'), opts);
  }

  /**
   * Dismiss the open modal overlay.
   */
  @Method()
  dismiss(data?: any, role?: string, id?: string) {
    return dismissOverlay(document, data, role, 'ion-modal', id);
  }

  /**
   * Get the most recently opened modal overlay.
   */
  @Method()
  async getTop(): Promise<HTMLIonModalElement | undefined> {
    return getOverlay(document, 'ion-modal') as HTMLIonModalElement;
  }
}

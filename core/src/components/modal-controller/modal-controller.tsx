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
   *
   * @param options The options to use to create the modal.
   */
  @Method()
  create<T extends ComponentRef>(options: ModalOptions<T>): Promise<HTMLIonModalElement> {
    return createOverlay(this.doc.createElement('ion-modal'), options);
  }

  /**
   * Dismiss the open modal overlay.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the modal.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the modal.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   * @param id The id of the modal to dismiss. If an id is not provided, it will dismiss the most recently opened modal.
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

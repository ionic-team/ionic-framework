import { Component, Listen, Method } from '@stencil/core';
import { ModalEvent, ModalOptions, OverlayController } from '../../index';
import { createOverlay, dismissOverlay, getTopOverlay, removeLastOverlay } from '../../utils/overlays';


@Component({
  tag: 'ion-modal-controller'
})
export class ModalController implements OverlayController {

  private modals = new Map<number, HTMLIonModalElement>();

  @Listen('body:ionModalWillPresent')
  protected modalWillPresent(ev: ModalEvent) {
    this.modals.set(ev.target.overlayId, ev.target);
  }

  @Listen('body:ionModalWillDismiss, body:ionModalDidUnload')
  protected modalWillDismiss(ev: ModalEvent) {
    this.modals.delete(ev.target.overlayId);
  }

  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    removeLastOverlay(this.modals);
  }

  /*
   * Create a modal overlay with modal options.
   */
  @Method()
  create(opts?: ModalOptions): Promise<HTMLIonModalElement> {
    return createOverlay('ion-modal', opts);
  }

  /*
   * Dismiss the open modal overlay.
   */
  @Method()
  dismiss(data?: any, role?: string, modalId = -1) {
    return dismissOverlay(data, role, this.modals, modalId);
  }

  /*
   * Get the most recently opened modal overlay.
   */
  @Method()
  getTop(): HTMLIonModalElement {
    return getTopOverlay(this.modals);
  }
}

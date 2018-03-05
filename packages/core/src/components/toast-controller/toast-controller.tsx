import { Component, Listen, Method } from '@stencil/core';
import { OverlayController, ToastEvent, ToastOptions } from '../../index';
import { createOverlay, dismissOverlay, getTopOverlay, removeLastOverlay } from '../../utils/overlays';


@Component({
  tag: 'ion-toast-controller'
})
export class ToastController implements OverlayController {

  private toasts = new Map<number, HTMLIonToastElement>();

  @Listen('body:ionToastWillPresent')
  protected toastWillPresent(ev: ToastEvent) {
    this.toasts.set(ev.target.overlayId, ev.target);
  }

  @Listen('body:ionToastWillDismiss, body:ionToastDidUnload')
  protected toastWillDismiss(ev: ToastEvent) {
    this.toasts.delete(ev.target.overlayId);
  }

  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    removeLastOverlay(this.toasts);
  }

  /*
   * Create a toast overlay with toast options.
   */
  @Method()
  create(opts?: ToastOptions): Promise<HTMLIonToastElement> {
    return createOverlay('ion-toast', opts);
  }

  /*
   * Dismiss the open toast overlay.
   */
  @Method()
  dismiss(data?: any, role?: string, toastId = -1) {
    return dismissOverlay(data, role, this.toasts, toastId);
  }

  /*
   * Get the most recently opened toast overlay.
   */
  @Method()
  getTop(): HTMLIonToastElement {
    return getTopOverlay(this.toasts);
  }
}

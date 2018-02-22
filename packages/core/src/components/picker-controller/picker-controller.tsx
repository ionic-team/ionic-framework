import { Component, Listen, Method } from '@stencil/core';
import { OverlayController, PickerEvent, PickerOptions } from '../../index';
import { createOverlay, getTopOverlay, removeLastOverlay, dismissOverlay } from '../../utils/overlays';


@Component({
  tag: 'ion-picker-controller'
})
export class PickerController implements OverlayController {

  private pickers = new Map<number, HTMLIonPickerElement>();

  @Listen('body:ionPickerWillPresent')
  protected pickerWillPresent(ev: PickerEvent) {
    this.pickers.set(ev.target.overlayId, ev.target);
  }

  @Listen('body:ionPickerWillDismiss, body:ionPickerDidUnload')
  protected pickerWillDismiss(ev: PickerEvent) {
    this.pickers.delete(ev.target.overlayId);
  }

  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    removeLastOverlay(this.pickers);
  }

  /*
   * Create a picker overlay with picker options.
   */
  @Method()
  create(opts?: PickerOptions): Promise<HTMLIonPickerElement> {
    return createOverlay('ion-picker', opts);
  }

  /*
   * Dismiss the open picker overlay.
   */
  @Method()
  dismiss(data?: any, role?: any, pickerId = -1) {
    return dismissOverlay(data, role, this.pickers, pickerId);
  }

  /*
   * Get the most recently opened picker overlay.
   */
  @Method()
  getTop() {
    return getTopOverlay(this.pickers);
  }
}

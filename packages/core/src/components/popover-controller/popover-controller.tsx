import { Component, Listen, Method } from '@stencil/core';
import { OverlayController, PopoverEvent, PopoverOptions } from '../../index';
import { createOverlay, dismissOverlay, getTopOverlay, removeLastOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-popover-controller'
})
export class PopoverController implements OverlayController {

  private popovers = new Map<number, HTMLIonPopoverElement>();

  @Listen('body:ionPopoverWillPresent')
  protected popoverWillPresent(ev: PopoverEvent) {
    this.popovers.set(ev.target.overlayId, ev.target);
  }

  @Listen('body:ionPopoverWillDismiss, body:ionPopoverDidUnload')
  protected popoverWillDismiss(ev: PopoverEvent) {
    this.popovers.delete(ev.target.overlayId);
  }

  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    removeLastOverlay(this.popovers);
  }

  /*
   * Create a popover overlay with popover options.
   */
  @Method()
  create(opts?: PopoverOptions): Promise<HTMLIonPopoverElement> {
    return createOverlay('ion-popover', opts);
  }

  /*
   * Dismiss the open popover overlay.
   */
  @Method()
  dismiss(data?: any, role?: any, popoverId = -1) {
    return dismissOverlay(data, role, this.popovers, popoverId);
  }

  /*
   * Get the most recently opened popover overlay.
   */
  @Method()
  getTop() {
    return getTopOverlay(this.popovers);
  }
}

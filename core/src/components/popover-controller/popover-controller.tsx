import { Component, Listen, Method, Prop } from '@stencil/core';
import { PopoverOptions } from '../../interface';
import { OverlayController, createOverlay, dismissOverlay, getTopOverlay, removeLastOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-popover-controller'
})
export class PopoverController implements OverlayController {

  private popovers = new Map<number, HTMLIonPopoverElement>();

  @Prop({ context: 'document' }) doc!: Document;

  @Listen('body:ionPopoverWillPresent')
  protected popoverWillPresent(ev: any) {
    this.popovers.set(ev.target.overlayId, ev.target);
  }

  @Listen('body:ionPopoverWillDismiss')
  @Listen('body:ionPopoverDidUnload')
  protected popoverWillDismiss(ev: any) {
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
    return createOverlay(this.doc.createElement('ion-popover'), opts);
  }

  /*
   * Dismiss the open popover overlay.
   */
  @Method()
  dismiss(data?: any, role?: string, popoverId = -1) {
    return dismissOverlay(data, role, this.popovers, popoverId);
  }

  /*
   * Get the most recently opened popover overlay.
   */
  @Method()
  getTop(): HTMLIonPopoverElement {
    return getTopOverlay(this.popovers);
  }
}

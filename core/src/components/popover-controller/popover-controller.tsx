import { Component, ComponentInterface, Method, Prop } from '@stencil/core';

import { ComponentRef, OverlayController, PopoverOptions } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-popover-controller',
})
export class PopoverController implements ComponentInterface, OverlayController {

  @Prop({ context: 'document' }) doc!: Document;

  /**
   * Create a popover overlay with popover options.
   */
  @Method()
  create<T extends ComponentRef>(opts: PopoverOptions<T>): Promise<HTMLIonPopoverElement> {
    return createOverlay(this.doc.createElement('ion-popover'), opts);
  }

  /**
   * Dismiss the open popover overlay.
   */
  @Method()
  dismiss(data?: any, role?: string, id?: string) {
    return dismissOverlay(this.doc, data, role, 'ion-popover', id);
  }

  /**
   * Get the most recently opened popover overlay.
   */
  @Method()
  async getTop(): Promise<HTMLIonPopoverElement | undefined> {
    return getOverlay(this.doc, 'ion-popover') as HTMLIonPopoverElement;
  }
}

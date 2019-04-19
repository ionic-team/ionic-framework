import { Component, ComponentInterface, Method } from '@stencil/core';

import { ComponentRef, OverlayController, PopoverOptions } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-popover-controller',
})
export class PopoverController implements ComponentInterface, OverlayController {

  /**
   * Create a popover overlay with popover options.
   */
  @Method()
  create<T extends ComponentRef>(opts: PopoverOptions<T>): Promise<HTMLIonPopoverElement> {
    return createOverlay(document.createElement('ion-popover'), opts);
  }

  /**
   * Dismiss the open popover overlay.
   */
  @Method()
  dismiss(data?: any, role?: string, id?: string) {
    return dismissOverlay(document, data, role, 'ion-popover', id);
  }

  /**
   * Get the most recently opened popover overlay.
   */
  @Method()
  async getTop(): Promise<HTMLIonPopoverElement | undefined> {
    return getOverlay(document, 'ion-popover') as HTMLIonPopoverElement;
  }
}

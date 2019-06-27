import { Component, ComponentInterface, Method } from '@stencil/core';

import { ComponentRef, OverlayController, PopoverOptions } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-popover-controller',
})
export class PopoverController implements ComponentInterface, OverlayController {

  /**
   * Create a popover overlay with popover options.
   *
   * @param options The options to use to create the popover.
   */
  @Method()
  create<T extends ComponentRef>(options: PopoverOptions<T>): Promise<HTMLIonPopoverElement> {
    return createOverlay('ion-popover', options);
  }

  /**
   * Dismiss the open popover overlay.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the popover.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the popover.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   * @param id The id of the popover to dismiss. If an id is not provided, it will dismiss the most recently opened popover.
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

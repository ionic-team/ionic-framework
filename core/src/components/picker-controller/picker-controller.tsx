import { Component, ComponentInterface, Method } from '@stencil/core';

import { OverlayController, PickerOptions } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-picker-controller'
})
export class PickerController implements ComponentInterface, OverlayController {

  /**
   * Create a picker overlay with picker options.
   */
  @Method()
  create(opts: PickerOptions): Promise<HTMLIonPickerElement> {
    return createOverlay(document.createElement('ion-picker'), opts);
  }

  /**
   * Dismiss the open picker overlay.
   */
  @Method()
  dismiss(data?: any, role?: string, id?: string) {
    return dismissOverlay(document, data, role, 'ion-picker', id);
  }

  /**
   * Get the most recently opened picker overlay.
   */
  @Method()
  async getTop(): Promise<HTMLIonPickerElement | undefined> {
    return getOverlay(document, 'ion-picker') as HTMLIonPickerElement;
  }
}

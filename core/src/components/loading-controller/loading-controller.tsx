import { Component, ComponentInterface, Method } from '@stencil/core';

import { LoadingOptions, OverlayController } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-loading-controller'
})
export class LoadingController implements ComponentInterface, OverlayController {

  /**
   * Create a loading overlay with loading options.
   *
   * @param options The options to use to create the loading.
   */
  @Method()
  create(options?: LoadingOptions): Promise<HTMLIonLoadingElement> {
    return createOverlay('ion-loading', options);
  }

  /**
   * Dismiss the open loading overlay.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the loading.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the loading.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   * @param id The id of the loading to dismiss. If an id is not provided, it will dismiss the most recently opened loading.
   */
  @Method()
  dismiss(data?: any, role?: string, id?: string) {
    return dismissOverlay(document, data, role, 'ion-loading', id);
  }

  /**
   * Get the most recently opened loading overlay.
   */
  @Method()
  async getTop(): Promise<HTMLIonLoadingElement | undefined> {
    return getOverlay(document, 'ion-loading') as HTMLIonLoadingElement;
  }
}

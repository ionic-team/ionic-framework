import { Component, ComponentInterface, Method } from '@stencil/core';

import { LoadingOptions, OverlayController } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'ion-loading-controller'
})
export class LoadingController implements ComponentInterface, OverlayController {

  /**
   * Create a loading overlay with loading options.
   */
  @Method()
  create(opts?: LoadingOptions): Promise<HTMLIonLoadingElement> {
    return createOverlay(document.createElement('ion-loading'), opts);
  }

  /**
   * Dismiss the open loading overlay.
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

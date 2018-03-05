import { Component, Listen, Method } from '@stencil/core';
import { LoadingEvent, LoadingOptions, OverlayController } from '../../index';
import { createOverlay, dismissOverlay, getTopOverlay, removeLastOverlay } from '../../utils/overlays';


@Component({
  tag: 'ion-loading-controller'
})
export class LoadingController implements OverlayController {

  private loadings = new Map<number, HTMLIonLoadingElement>();

  @Listen('body:ionLoadingWillPresent')
  protected loadingWillPresent(ev: LoadingEvent) {
    this.loadings.set(ev.target.overlayId, ev.target);
  }

  @Listen('body:ionLoadingWillDismiss, body:ionLoadingDidUnload')
  protected loadingWillDismiss(ev: LoadingEvent) {
    this.loadings.delete(ev.target.overlayId);
  }

  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    removeLastOverlay(this.loadings);
  }

  /*
   * Create a loading overlay with loading options.
   */
  @Method()
  create(opts?: LoadingOptions): Promise<HTMLIonLoadingElement> {
    return createOverlay('ion-loading', opts);
  }

  /*
   * Dismiss the open loading overlay.
   */
  @Method()
  dismiss(data?: any, role?: string, loadingId = -1) {
    return dismissOverlay(data, role, this.loadings, loadingId);
  }

  /*
   * Get the most recently opened loading overlay.
   */
  @Method()
  getTop(): HTMLIonLoadingElement {
    return getTopOverlay(this.loadings);
  }
}

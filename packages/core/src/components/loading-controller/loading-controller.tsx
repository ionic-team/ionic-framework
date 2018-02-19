import { Component, Listen, Method } from '@stencil/core';
import { LoadingEvent, LoadingOptions, OverlayController } from '../../index';

let ids = 0;
const loadings = new Map<number, HTMLIonLoadingElement>();

@Component({
  tag: 'ion-loading-controller'
})
export class LoadingController implements OverlayController {

  @Listen('body:ionLoadingWillPresent')
  protected loadingWillPresent(ev: LoadingEvent) {
    loadings.set(ev.target.loadingId, ev.target);
  }

  @Listen('body:ionLoadingWillDismiss, body:ionLoadingDidUnload')
  protected loadingWillDismiss(ev: LoadingEvent) {
    loadings.delete(ev.target.loadingId);
  }

  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    removeLastLoading();
  }

  /*
   * Create a loading overlay with loading options.
   */
  @Method()
  create(opts?: LoadingOptions): Promise<HTMLIonLoadingElement> {
    // create ionic's wrapping ion-loading component
    const loadingElement = document.createElement('ion-loading');

    // give this loading a unique id
    loadingElement.loadingId = ids++;

    // convert the passed in loading options into props
    // that get passed down into the new loading
    Object.assign(loadingElement, opts);

    // append the loading element to the document body
    const appRoot = document.querySelector('ion-app') || document.body;
    appRoot.appendChild(loadingElement);

    return loadingElement.componentOnReady();
  }

  /*
   * Dismiss the open loading overlay.
   */
  @Method()
  dismiss(data?: any, role?: any, loadingId = -1) {
    loadingId = loadingId >= 0 ? loadingId : getHighestId();
    const loading = loadings.get(loadingId);
    return loading.dismiss(data, role);
  }

  /*
   * Get the most recently opened loading overlay.
   */
  @Method()
  getTop() {
    return loadings.get(getHighestId());
  }
}

function getHighestId() {
  let minimum = -1;
  loadings.forEach((_loading: HTMLIonLoadingElement, id: number) => {
    if (id > minimum) {
      minimum = id;
    }
  });
  return minimum;
}

function removeLastLoading() {
  const toRemove = loadings.get(getHighestId());
  return toRemove ? toRemove.dismiss() : Promise.resolve();
}

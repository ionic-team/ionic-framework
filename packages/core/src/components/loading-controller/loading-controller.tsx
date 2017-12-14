import { Component, Listen, Method } from '@stencil/core';
import { LoadingEvent, LoadingOptions } from '../../index';


@Component({
  tag: 'ion-loading-controller'
})
export class LoadingController {
  private ids = 0;
  private loadingResolves: {[loadingId: string]: Function} = {};
  private loadings: HTMLIonLoadingElement[] = [];

  /**
   * Create a loading overlay and pass options to it
   */
  @Method()
  create(opts?: LoadingOptions): Promise<HTMLIonLoadingElement> {
    // create ionic's wrapping ion-loading component
    const loading = document.createElement('ion-loading');

    const id = this.ids++;

    // give this loading a unique id
    loading.loadingId = `loading-${id}`;

    // convert the passed in loading options into props
    // that get passed down into the new loading
    Object.assign(loading, opts);

    // append the loading element to the document body
    const appRoot = document.querySelector('ion-app') || document.body;
    appRoot.appendChild(loading as any);

    // store the resolve function to be called later up when the loading loads
    return new Promise<HTMLIonLoadingElement>(resolve => {
      this.loadingResolves[loading.loadingId] = resolve;
    });
  }


  @Listen('body:ionLoadingDidLoad')
  protected didLoad(ev: LoadingEvent) {
    const loading = ev.target as HTMLIonLoadingElement;
    const loadingResolve = this.loadingResolves[loading.loadingId];
    if (loadingResolve) {
      loadingResolve(loading);
      delete this.loadingResolves[loading.loadingId];
    }
  }


  @Listen('body:ionLoadingWillPresent')
  protected willPresent(ev: LoadingEvent) {
    this.loadings.push(ev.target as HTMLIonLoadingElement);
  }


  @Listen('body:ionLoadingWillDismiss, body:ionLoadingDidUnload')
  protected willDismiss(ev: LoadingEvent) {
    const index = this.loadings.indexOf(ev.target as HTMLIonLoadingElement);
    if (index > -1) {
      this.loadings.splice(index, 1);
    }
  }


  @Listen('body:keyup.escape')
  protected escapeKeyUp() {
    const lastLoading = this.loadings[this.loadings.length - 1];
    if (lastLoading) {
      lastLoading.dismiss();
    }
  }

}

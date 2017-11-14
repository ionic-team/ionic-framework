import { Component, Listen, Method } from '@stencil/core';
import { ComponentEvent, Loading, LoadingOptions } from '../../index';


@Component({
  tag: 'ion-loading-controller'
})
export class LoadingController {
  private ids = 0;
  private loadingResolves: {[loadingId: string]: Function} = {};
  private loadings: Loading[] = [];

  @Method()
  create(opts?: LoadingOptions): Promise<Loading> {
    // create ionic's wrapping ion-loading component
    const loading = document.createElement('ion-loading');

    const id = this.ids++;

    // give this loading a unique id
    loading.loadingId = `loading-${id}`;
    loading.style.zIndex = (20000 + id).toString();

    // convert the passed in loading options into props
    // that get passed down into the new loading
    Object.assign(loading, opts);

    // append the loading element to the document body
    const appRoot = document.querySelector('ion-app') || document.body;
    appRoot.appendChild(loading as any);

    // store the resolve function to be called later up when the loading loads
    return new Promise<Loading>(resolve => {
      this.loadingResolves[loading.loadingId] = resolve;
    });
  }


  @Listen('body:ionLoadingDidLoad')
  protected viewDidLoad(ev: ComponentEvent<Loading>) {
    const loading = ev.detail.component;
    const loadingResolve = this.loadingResolves[loading.loadingId];
    if (loadingResolve) {
      loadingResolve(loading);
      delete this.loadingResolves[loading.loadingId];
    }
  }


  @Listen('body:ionLoadingWillPresent')
  protected willPresent(ev: ComponentEvent<Loading>) {
    this.loadings.push(ev.detail.component);
  }


  @Listen('body:ionLoadingWillDismiss, body:ionLoadingDidUnload')
  protected willDismiss(ev: ComponentEvent<Loading>) {
    const index = this.loadings.indexOf(ev.detail.component);
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

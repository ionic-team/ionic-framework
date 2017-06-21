import { Component, Ionic, Listen } from '../index';
import { GlobalNamespace, LoadingEvent, LoadingOptions, Loading, IonicControllerApi } from '../../util/interfaces';


@Component({
  tag: 'ion-loading-controller',
  styleUrls: 'loading-controller.scss'
})
export class LoadingController implements IonicControllerApi {
  private ids = 0;
  private loadingResolves: {[loadingId: string]: Function} = {};
  private loadings: Loading[] = [];
  private appRoot: Element;


  ionViewDidLoad() {
    this.appRoot = document.querySelector('ion-app') || document.body;
    (<GlobalNamespace>Ionic).loadController('loading', this);
  }


  load(opts?: LoadingOptions) {
    // create ionic's wrapping ion-loading component
    const loading: Loading = document.createElement<any>('ion-loading');

    const id = this.ids++;

    // give this loading a unique id
    loading.id = `loading-${id}`;
    loading.style.zIndex = (20000 + id);

    // convert the passed in loading options into props
    // that get passed down into the new loading
    Object.assign(loading, opts);

    // append the loading element to the document body
    this.appRoot.appendChild(<any>loading);

    // store the resolve function to be called later up when the loading loads
    return new Promise<Loading>(resolve => {
      this.loadingResolves[loading.id] = resolve;
    });
  }


  @Listen('body:ionLoadingDidLoad')
  viewDidLoad(ev: LoadingEvent) {
    const loading = ev.detail.loading;
    const loadingResolve = this.loadingResolves[loading.id];
    if (loadingResolve) {
      loadingResolve(loading);
      delete this.loadingResolves[loading.id];
    }
  }


  @Listen('body:ionLoadingWillPresent')
  willPresent(ev: LoadingEvent) {
    this.loadings.push(ev.detail.loading);
  }


  @Listen('body:ionLoadingWillDismiss, body:ionLoadingDidUnload')
  willDismiss(ev: LoadingEvent) {
    const index = this.loadings.indexOf(ev.detail.loading);
    if (index > -1) {
      this.loadings.splice(index, 1);
    }
  }


  @Listen('body:keyup.escape')
  escapeKeyUp() {
    const lastLoading = this.loadings[this.loadings.length - 1];
    if (lastLoading) {
      lastLoading.dismiss();
    }
  }

}

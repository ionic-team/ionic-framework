import { Component, Listen, Method} from '@stencil/core';


@Component({
  tag: 'ion-cordova-platform',
})
export class CordovaPlatform {

  private readyPromise: Promise<void>;
  private readyResolve: Function;

  constructor() {
    this.readyPromise = new Promise(resolve => this.readyResolve = resolve);
  }

  @Method()
  ready(): Promise<void> {
    return this.readyPromise;
  }

  @Listen('document:deviceready')
  deviceReadyHandler() {
    this.readyResolve();
  }

  @Method()
  @Listen('body:exitApp')
  exitCordovaApp() {
    // this is lifted directly from Ionic 3
    const app = (window.navigator as any).app;
    if (app && app.exitApp) {
      app.exitApp();
    }
  }
}

import { Component, Listen, Method} from '@stencil/core';

let isReady = false;
let readyQueue: Function[] = [];

@Component({
  tag: 'ion-cordova-platform',
  styleUrls: {
    ios: 'cordova-platform.ios.scss',
    md: 'cordova-platform.md.scss'
  },
  host: {
    theme: 'cordova-platform'
  }
})
export class CordovaPlatform {

  @Method()
  ready() {
    return readyImpl();
  }

  @Listen('document:deviceready')
  deviceReadyHandler() {
    isReady = true;
    processReadyQueue();
  }

  @Listen('body:exitApp')
  exitCordovaApp() {
    // this is lifted directly from Ionic 3
    ((window.navigator as any).app as any).exitApp();
  }

  componentDidLoad() {
    readyImpl().then(() => {
      // okay cool, we've received the ready event, we need to listen for the other events now
      document.addEventListener('backbutton', handleBackButton);

      document.addEventListener('resume', handleResume);

      document.addEventListener('pause', handlePause);
    });
  }
}

export function handleBackButton() {
  return getHydratedApp().then((app: HTMLIonAppElement) => {
    return app.hardwareBackButtonPressed();
  });
}

export function handleResume() {
  return getHydratedApp().then((app: HTMLIonAppElement) => {
    return app.appResume();
  });
}

export function handlePause() {
  return getHydratedApp().then((app: HTMLIonAppElement) => {
    return app.appPaused();
  });
}

export function getHydratedApp() {
  const app = document.querySelector('ion-app');
  return (app as any).componentOnReady();
}

export function readyImpl(): Promise<any> {
  if (isReady) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    readyQueue.push(resolve);
  });
}

export function processReadyQueue() {
  for (const resolve of readyQueue) {
    resolve();
  }
  readyQueue = [];
}

import {App, Page, IonicApp, Platform} from 'ionic/ionic';

@App({
  templateUrl: 'app.html',
  config: CONFIG_DEMO || {}
})
class ApiDemoApp {

  constructor() {
    this.rootPage = TabPage;
  }
}

@Page({
  templateUrl: 'tabs.html'
})
export class TabPage {
  constructor() {
    this.tabOne = InitialPage;
  }
}


@Page({
  templateUrl: 'main.html'
})
export class InitialPage {
  constructor(platform: Platform) {
    this.platform = platform;
    if (window.localStorage.getItem('configDemo') !== null) {
      this.config = JSON.parse(window.localStorage.getItem('configDemo'));
    }
    else if (platform.is('ios')) {
      this.config = {
        'backButtonIcon': 'ion-ios-arrow-back',
        'iconMode': 'ios',
        'tabbarPlacement': 'bottom'
      };
    } else {
      this.config = {
        'backButtonIcon': 'ion-md-arrow-back',
        'iconMode': 'md',
        'tabbarPlacement': 'top'
      };
    }

    this.initialConfig = JSON.parse(JSON.stringify(this.config));
  }

  load() {
    window.localStorage.setItem('configDemo', JSON.stringify(this.config));
    window.location.reload();
  }
}

import {App, Page, IonicApp, Platform} from 'ionic/ionic';

@App({
  templateUrl: 'app.html'
})
class ApiDemoApp {

  constructor() {
    this.rootPage = InitialPage;
  }
}

@Page({
  templateUrl: 'main.html'
})
export class InitialPage {
  constructor(platform: Platform) {
    this.isIos = platform.is('ios');
    this.isAndroid = platform.is('android');
    this.userAgent = platform.userAgent();
  }
}


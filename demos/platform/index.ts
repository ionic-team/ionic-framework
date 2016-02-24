import {App, Platform} from 'ionic-angular';

@App({
  templateUrl: 'main.html'
})
class ApiDemoApp {
  constructor(platform: Platform) {
    this.isIos = platform.is('ios');
    this.isAndroid = platform.is('android');
    this.userAgent = platform.userAgent();
  }
}

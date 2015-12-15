import {App, Platform} from 'ionic/ionic';

@App({
  templateUrl: 'main.html'
})

class DemoApp {
  constructor(platform: Platform) {
    this.platform = platform;
    this.pet = "puppies";
    this.isAndroid = platform.is('android');
  }
}

import {Component} from '@angular/core';
import {ionicBootstrap, Platform} from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
class ApiDemoApp {
  isIos: boolean;
  isAndroid: boolean;
  isWindows: boolean;

  constructor(platform: Platform) {
    this.isIos = platform.is('ios');
    this.isAndroid = platform.is('android');
    this.isWindows = platform.is('windows');
  }
}

ionicBootstrap(ApiDemoApp);

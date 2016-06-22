import { Component } from '@angular/core';

import { ionicBootstrap, Platform } from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
class ApiDemoPage {
  isIos: boolean;
  isAndroid: boolean;
  isWindows: boolean;

  constructor(platform: Platform) {
    this.isIos = platform.is('ios');
    this.isAndroid = platform.is('android');
    this.isWindows = platform.is('windows');
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class ApiDemoApp {
  root = ApiDemoPage;
}

ionicBootstrap(ApiDemoApp);

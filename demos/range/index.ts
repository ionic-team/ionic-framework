import { Component } from '@angular/core';

import { ionicBootstrap } from 'ionic-angular';

@Component({
  templateUrl: 'main.html'
})
class ApiDemoPage {
  brightness: number = 20;
  saturation: number = 0;
  warmth: number = 1300;
  structure: any = {lower: 33, upper: 60};

  onChange(ev) {
    console.log("Changed", ev);
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class ApiDemoApp {
  root = ApiDemoPage;
}

ionicBootstrap(ApiDemoApp);

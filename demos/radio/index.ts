import { Component } from '@angular/core';

import { ionicBootstrap } from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
class ApiDemoPage {
  isDisabled = true;
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class ApiDemoApp {
  root = ApiDemoPage;
}

ionicBootstrap(ApiDemoApp);

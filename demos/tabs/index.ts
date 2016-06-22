import { Component, ViewEncapsulation } from '@angular/core';

import { ionicBootstrap } from 'ionic-angular';


@Component({
  template: 'tab',
})
class TabPage {}


@Component({
  templateUrl: 'main.html',
  styleUrls: ['style.css'],
  encapsulation: ViewEncapsulation.None
})
class ApiDemoPage {
  root = TabPage;
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class ApiDemoApp {
  root = ApiDemoPage;
}

ionicBootstrap(ApiDemoApp);

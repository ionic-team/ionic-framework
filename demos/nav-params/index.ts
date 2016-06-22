import { Component } from '@angular/core';

import { ionicBootstrap, NavController, NavParams } from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
export class ApiDemoPage {
  myParam: string = '';

  constructor(public nav: NavController) {}

  pushParams() {
    this.nav.push(PushPage, { 'myParam': this.myParam });
  }
}


@Component({
  templateUrl: "page.html"
})
export class PushPage {
  myParam: string;

  constructor(public nav: NavController, params: NavParams) {
    this.myParam = params.get('myParam');
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class ApiDemoApp {
  root = ApiDemoPage;
}

ionicBootstrap(ApiDemoApp);

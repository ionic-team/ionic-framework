import { Component } from '@angular/core';

import { ionicBootstrap, NavController, NavParams } from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
export class ApiDemoPage {
  myParam: string = '';

  constructor(public navCtrl: NavController) {}

  pushParams() {
    this.navCtrl.push(PushPage, { 'myParam': this.myParam });
  }
}


@Component({
  templateUrl: "page.html"
})
export class PushPage {
  myParam: string;

  constructor(params: NavParams) {
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

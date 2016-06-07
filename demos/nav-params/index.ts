import {Component} from '@angular/core';
import {ionicBootstrap, NavController, NavParams} from 'ionic-angular';


@Component({
  templateUrl: 'main.html'
})
export class InitialPage {
  myParam = '';

  constructor(public nav: NavController) {}

  pushParams() {
    this.nav.push(Page2, { 'myParam': this.myParam });
  }
}


@Component({
  templateUrl: "page-2.html"
})
export class Page2 {
  myParam: string;

  constructor(public nav: NavController, params: NavParams) {
    this.myParam = params.get('myParam');
  }
}


@Component({
  templateUrl: 'app.html'
})
class ApiDemoApp {
  root = InitialPage;
}

ionicBootstrap(ApiDemoApp);

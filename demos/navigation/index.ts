import {Component} from '@angular/core';
import {ionicBootstrap, Config, Platform, NavController, NavParams} from 'ionic-angular';

var PAGE_NUM = 2;


@Component({
  templateUrl: 'main.html'
})
export class InitialPage {
  constructor(public nav: NavController) {}

  push() {
    this.nav.push(Page2);
  }
}

@Component({
  templateUrl: "page-2.html"
})
export class Page2 {
  pageNum = PAGE_NUM;

  constructor(private nav: NavController) {}

  push() {
    PAGE_NUM++;
    this.nav.push(Page2);
  }

  pop() {
    if (PAGE_NUM > 2) {
      PAGE_NUM--;
    }
    this.nav.pop();
  }
}


@Component({
  templateUrl: 'app.html'
})
class ApiDemoApp {
  root = InitialPage;
}

ionicBootstrap(ApiDemoApp);

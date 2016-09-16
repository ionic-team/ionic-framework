import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

let pageNum = 2;

@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
  constructor(public navCtrl: NavController) {}

  push() {
    this.navCtrl.push(PushPage);
  }
}

@Component({
  templateUrl: 'push-page.html'
})
export class PushPage {
  pageNum = pageNum;

  constructor(public navCtrl: NavController) {}

  push() {
    pageNum++;
    this.navCtrl.push(PushPage);
  }

  pop() {
    if (pageNum > 2) {
      pageNum--;
    }
    this.navCtrl.pop();
  }
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class ApiDemoApp {
  root = ApiDemoPage;
}

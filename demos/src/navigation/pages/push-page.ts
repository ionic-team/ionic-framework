import { Component } from '@angular/core';
import { NavController } from '../../../../src';

let pageNum = 2;

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

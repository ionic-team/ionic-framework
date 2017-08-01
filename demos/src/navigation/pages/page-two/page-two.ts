import { Component } from '@angular/core';
import { NavController } from '../../../../../src';

let pageNum = 2;

@Component({
  templateUrl: 'page-two.html'
})
export class PageTwo {
  pageNum = pageNum;

  constructor(public navCtrl: NavController) {}

  push() {
    pageNum++;
    this.navCtrl.push(PageTwo);
  }

  pop() {
    if (pageNum > 2) {
      pageNum--;
    }
    this.navCtrl.pop();
  }
}

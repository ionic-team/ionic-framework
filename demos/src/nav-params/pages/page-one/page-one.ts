import { Component } from '@angular/core';
import { NavController } from '../../../../../src';
import { PageTwo } from '../page-two/page-two';

@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  myParam: string = '';

  constructor(public navCtrl: NavController) {}

  pushParams() {
    this.navCtrl.push(PageTwo, { 'myParam': this.myParam });
  }
}

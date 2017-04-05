import { Component } from '@angular/core';
import { NavController } from '../../../../../src';
import { PageTwo }from '../page-two/page-two';

@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  constructor(public navCtrl: NavController) {}

  push() {
    this.navCtrl.push(PageTwo);
  }
}

import { Component } from '@angular/core';
import { NavController } from '../../../../../..';

@Component({
  templateUrl: 'page-two.html'
})
export class PageTwo {
  constructor(
    public navCtrl: NavController,
  ) { }

  push() {
    this.navCtrl.push(PageTwo);
  }
}

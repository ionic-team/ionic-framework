import { Component } from '@angular/core';
import { NavController } from '../../../../../..';

@Component({
  templateUrl: 'page-four.html'
})
export class PageFour {
  constructor(
    public navCtrl: NavController,
  ) { }

  push() {
    this.navCtrl.push(PageFour);
  }
}

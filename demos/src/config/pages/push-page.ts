import { Component } from '@angular/core';
import { NavController } from '../../../../src';

@Component({
  templateUrl: 'push-page.html'
})
export class PushPage {
  constructor(public navCtrl: NavController) {}

  pop() {
    this.navCtrl.pop();
  }
}

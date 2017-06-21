import { Component } from '@angular/core';
import { NavController } from '../../../../../src';

@Component({
  templateUrl: 'page-three.html'
})
export class PageThree {
  constructor(public navCtrl: NavController) {}

  pop() {
    this.navCtrl.pop();
  }
}

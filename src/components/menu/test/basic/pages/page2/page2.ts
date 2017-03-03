import { Component } from '@angular/core';
import { NavController } from '../../../../../..';

@Component({ templateUrl: 'page2.html' })
export class Page2 {
  constructor(public navCtrl: NavController) { }

  page3() {
    this.navCtrl.push('Page3');
  }
}

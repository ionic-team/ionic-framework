import { Component } from '@angular/core';
import { DeepLink, NavController } from '../../../../../..';

@DeepLink()
@Component({
  templateUrl: 'page-three.html'
})
export class PageThree {
  constructor(public navCtrl: NavController) { }

  page3() {
    this.navCtrl.push('PageFour');
  }
}

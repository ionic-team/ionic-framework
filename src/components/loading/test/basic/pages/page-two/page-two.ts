import { Component } from '@angular/core';
import { DeepLink, NavController } from '../../../../../..';

@DeepLink()
@Component({
  templateUrl: 'page-two.html'
})
export class PageTwo {
  constructor(public navCtrl: NavController) {}

  goToPage3() {
    this.navCtrl.push('PageThree');
  }
}

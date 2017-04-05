import { Component } from '@angular/core';
import { IonicPage, NavController } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'page-two.html'
})
export class PageTwo {
  constructor(public navCtrl: NavController) {}

  goToPage3() {
    this.navCtrl.push('PageThree');
  }
}

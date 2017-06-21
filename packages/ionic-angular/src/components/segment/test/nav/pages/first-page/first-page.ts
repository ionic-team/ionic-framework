import { Component } from '@angular/core';
import { IonicPage, NavController } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'first-page.html'
})
export class FirstPage {
  signInType: string;
  constructor(public navCtrl: NavController) {
    this.signInType = 'new';
  }
  goToPage2() {
    this.navCtrl.push('SecondPage');
  }
}

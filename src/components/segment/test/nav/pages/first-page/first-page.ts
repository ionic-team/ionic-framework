import { Component } from '@angular/core';
import { DeepLink, NavController } from '../../../../../..';

@DeepLink()
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

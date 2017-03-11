import { Component } from '@angular/core';
import { DeepLink, NavController } from '../../../../../..';

@DeepLink()
@Component({
  templateUrl: 'main-page.html'
})
export class MainPage {
  constructor(public navCtrl: NavController) { }

  goToSecond() {
    this.navCtrl.push('SearchPage');
  }
}

import { Component } from '@angular/core';
import { NavController } from '../../../../../..';

@Component({
  templateUrl: 'main.html'
})
export class MainPage {
  constructor(public navCtrl: NavController) { }

  goToSecond() {
    this.navCtrl.push('SearchPage');
  }
}

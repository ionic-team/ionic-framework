import { Component } from '@angular/core';
import { NavController } from '../../../../../..';

@Component({
  template: '<ion-content></ion-content>'
})
export class RedirectPage {
  constructor(public navCtrl: NavController) { }
  ionViewDidEnter() {
    this.navCtrl.push('primary-header-page');
  }
}

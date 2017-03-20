import { Component } from '@angular/core';
import { IonicPage, NavController } from '../../../../../..';

@IonicPage({
  name: 'redirect-page'
})
@Component({
  template: '<ion-content></ion-content>'
})
export class RedirectPage {
  constructor(public navCtrl: NavController) { }
  ionViewDidEnter() {
    this.navCtrl.push('primary-header-page');
  }
}

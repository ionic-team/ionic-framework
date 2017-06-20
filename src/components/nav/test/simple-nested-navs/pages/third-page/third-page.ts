import { Component } from '@angular/core';
import { IonicPage, NavController } from '../../../../../..';

@IonicPage()
@Component({
  selector: 'page-home',
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>Tab 1</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content>
    Third Page
  </ion-content>
  `
})
export class ThirdPage {

  constructor(public navCtrl: NavController) {

  }

}

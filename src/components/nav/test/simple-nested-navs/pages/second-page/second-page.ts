import { Component } from '@angular/core';
import { IonicPage, NavController } from '../../../../../..';

@IonicPage()
@Component({
  selector: 'page-home',
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>Tab 2</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content>
    Second Page
  </ion-content>
  `
})
export class SecondPage {

  constructor(public navCtrl: NavController) {

  }

}

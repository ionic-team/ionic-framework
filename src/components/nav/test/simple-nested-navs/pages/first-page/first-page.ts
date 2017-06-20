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
    <button ion-button (click)="goToNextPage()">Go to Next Page</button>
  </ion-content>
  `
})
export class FirstPage {

  constructor(public navCtrl: NavController) {

  }

  goToNextPage() {
    this.navCtrl.push('ThirdNav');
  }
}

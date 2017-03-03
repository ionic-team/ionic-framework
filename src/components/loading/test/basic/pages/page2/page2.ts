import { Component } from '@angular/core';
import { NavController } from '../../../../../..';
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Page 2</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>Some content</ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-buttons end>
          <button ion-button icon-right (click)="goToPage3()">
            Navigate
            <ion-icon name="arrow-forward"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `
})
export class Page2 {
  constructor(public navCtrl: NavController) {}

  goToPage3() {
    this.navCtrl.push('page3');
  }
}

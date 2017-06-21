import { Component } from '@angular/core';
import { IonicPage, NavController } from '../../../../../..';

@IonicPage()
@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>
        Landing Page Comp
      </ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content>
    <ion-button color="primary" (click)="goToPage()" class="e2eChildNavsNested">
      Nested Children Test
    </ion-button>
  </ion-content>
  `
})
export class LandingPage {

  constructor(public navCtrl: NavController) {}

  goToPage() {
    this.navCtrl.push('FirstPage');
  }
}

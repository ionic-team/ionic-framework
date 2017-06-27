import { Component } from '@angular/core';
import { IonicPage, NavController, } from '../../../../../..';

@IonicPage()
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Nav One</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content>
      Nav 1 Page 1
      <button ion-button (click)="goToTabs()">Go to Tabs 1</button>
    </ion-content>
  `
})
export class NonTabOne {

  constructor(public nav: NavController) {
  }

  goToTabs() {
    this.nav.push('TabsOnePage');
  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, } from '../../../../../..';

@IonicPage()
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Nav Two</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content>
      Nav 2 Page 1
      <button ion-button (click)="goToTabs()">Go to Tabs 2</button>
    </ion-content>
  `
})
export class NonTabTwo {
  constructor(public nav: NavController) {
  }

  goToTabs() {
    this.nav.push('TabsTwoPage');
  }
}

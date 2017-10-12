import { Component } from '@angular/core';
import { IonicPage, NavController, } from '../../../../../../..';

@IonicPage({
  segment: 'TabsTwoTabTwoPageOne'
})
@Component({
  template: `
<ion-header>
  <ion-navbar>
    <button ion-button menuToggle>
      <ion-icon name="menu"></ion-icon>
    </button>
    <ion-title>Tabs 2 Tab 2 Page 1</ion-title>
  </ion-navbar>
</ion-header>
<ion-content>
  Tabs 2 Tab 2 Page 1
  <button ion-button (click)="nextPage()">Go to Next Page</button>
</ion-content>
  `
})
export class TabsTwoTabTwoPageOne {
  constructor(public nav: NavController) {
  }

  nextPage() {
    this.nav.push('TabsTwoTabTwoPageTwo', { userId: '456', name: 'Michael Scarn'});
  }
}

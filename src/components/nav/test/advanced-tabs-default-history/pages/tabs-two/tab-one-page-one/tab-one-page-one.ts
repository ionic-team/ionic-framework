import { Component } from '@angular/core';
import { IonicPage, NavController, } from '../../../../../../..';

@IonicPage({
  segment: 'TabsTwoTabOnePageOne'
})
@Component({
  template: `
<ion-header>
  <ion-navbar>
    <ion-title>Tabs 2 Tab 1 Page 1</ion-title>
  </ion-navbar>
</ion-header>
<ion-content>
  Tabs 2 Tab 1 Page 1
  <button ion-button (click)="nextPage()">Go to Next Page</button>
</ion-content>
  `
})
export class TabsTwoTabOnePageOne {
  constructor(public nav: NavController) {
  }

  nextPage() {
    this.nav.push('TabsTwoTabOnePageTwo', { userId: '234', name: 'Phillis Vance - Vance Refridgeration'});
  }
}

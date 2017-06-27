import { Component } from '@angular/core';
import { IonicPage, NavController, } from '../../../../../../..';

@IonicPage({
  segment: 'TabsOneTabTwoPageOne'
})
@Component({
  template: `
<ion-header>
  <ion-navbar>
    <ion-title>Tabs 1 Tab 2 Page 1</ion-title>
  </ion-navbar>
</ion-header>
<ion-content>
  Tabs 1 Tab 2 Page 1
  <button ion-button (click)="nextPage()">Go to Next Page</button>
</ion-content>
  `
})
export class TabsOneTabTwoPageOne {
  constructor(public nav: NavController) {
  }

  nextPage() {
    this.nav.push('TabsOneTabTwoPageTwo', { userId: '456', name: 'Stanley Hudson'});
  }
}

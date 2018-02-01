import { Component } from '@angular/core';
import { IonicPage, NavController, } from '../../../../../..';

@IonicPage()
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <button ion-button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>Root Page</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content>
      Root Page
      <button ion-button secondary menuToggle>Toggle Menu</button>
    </ion-content>
  `
})
export class RootPage {

  constructor(public nav: NavController) {
  }
}

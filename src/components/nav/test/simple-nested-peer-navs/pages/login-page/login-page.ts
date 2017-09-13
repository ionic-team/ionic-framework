import { Component } from '@angular/core';
import { IonicPage, NavController, } from '../../../../../..';

@IonicPage()
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Login</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content>
      <button ion-button (click)="clickMe()">Login</button>
    </ion-content>
  `
})
export class LoginPage {
  constructor(public nav: NavController) {
  }

  clickMe() {
    this.nav.push('LandingPage');
  }
}

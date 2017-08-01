import { Component } from '@angular/core';
import { MenuController, NavController } from '../../../../../..';

@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <button ion-button menuToggle>
        <ion-icon name="menu"></ion-icon>
      </button>
      <ion-title>Navigation</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content padding>
    <h1>Page 1</h1>
    <button ion-button (click)="push()">Push</button>
    <button ion-button (click)="menu()">Disable/enable menu</button>
    <div f></div>
    <div f></div>
    <div f></div>
    <div f></div>

  </ion-content>
  `
})
export class PageOne {
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
  ) { }

  push() {
    this.navCtrl.push('PageTwo');
  }

  menu() {
    this.menuCtrl.enable(!this.menuCtrl.isEnabled());
  }
}

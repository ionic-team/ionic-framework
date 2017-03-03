import { Component } from '@angular/core';
import { NavController, NavParams } from '../../../../../..';

@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Second Page Header</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>
      <p>
        <button ion-button (click)="navCtrl.pop()">Pop (Go back to 1st)</button>
      </p>
      <div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div>
      <div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div><div f></div>
    </ion-content>
  `
})
export class ModalSecondPage {
  constructor(public navCtrl: NavController, params: NavParams) {
    console.log('Second page params:', params);
  }

  ionViewDidLoad() {
    console.log('ModalSecondPage ionViewDidLoad');
  }

  ionViewWillEnter() {
    console.log('ModalSecondPage ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('ModalSecondPage ionViewDidEnter');
  }
}

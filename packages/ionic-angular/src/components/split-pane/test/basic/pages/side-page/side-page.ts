import { Component } from '@angular/core';
import { NavController } from '../../../../../..';

@Component({
  template: `
  <ion-header>
  <ion-navbar><ion-title>Navigation</ion-title></ion-navbar>
  </ion-header>
  <ion-content>
  <ion-list>
    <ion-item>Hola 1</ion-item>
    <ion-item>Hola 2</ion-item>
    <ion-item>Hola 3</ion-item>
    <button ion-item (click)="push()">Push</button>
    <ion-item>Hola</ion-item>
    <ion-item>Hola</ion-item>
    <ion-item>Hola</ion-item>

  </ion-list>
  </ion-content>
  `
})
export class SidePage {
  constructor(public navCtrl: NavController) { }
  push() {
    this.navCtrl.push(SidePage);
  }
}

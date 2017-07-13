import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '../../../../../..';

@IonicPage({
  segment: 'secondPage/userId/:userId/name/:name'
})
@Component({
  selector: 'page-home',
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>Second Page</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content>
    Second Page
    User ID: {{userId}}
    Name: {{name}}
    <button ion-button (click)="goToNextPage()">Go to Next Page</button>
  </ion-content>
  `
})
export class SecondPage {

  userId: string;
  name: string;

  constructor(public navCtrl: NavController, public params: NavParams) {
  }

  ionViewWillEnter() {
    this.userId = this.params.data.userId;
    this.name = this.params.data.name;
  }

  goToNextPage() {
    this.navCtrl.push('ThirdPage', { paramOne: 'Oscar Martinez', paramTwo: 'Jim Halpert'});
  }
}

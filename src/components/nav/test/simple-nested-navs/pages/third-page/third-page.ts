import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '../../../../../..';

@IonicPage({
  segment: 'thirdPage/paramOne/:paramOne/paramTwo/:paramTwo'
})
@Component({
  selector: 'page-home',
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>Third Page</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content>
    Third Page
    Param One: {{paramOne}}
    Param Two: {{paramTwo}}
  </ion-content>
  `
})
export class ThirdPage {

  paramOne: string;
  paramTwo: string;
  constructor(public navCtrl: NavController, public params: NavParams) {
  }

  ionViewWillEnter() {
    this.paramOne = this.params.data.paramOne;
    this.paramTwo = this.params.data.paramTwo;
  }
}

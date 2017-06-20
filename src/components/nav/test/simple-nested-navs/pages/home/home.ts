import { Component } from '@angular/core';
import { IonicPage, NavController } from '../../../../../..';

@IonicPage()
@Component({
  selector: 'page-home',
  template: `
<ion-header>
  <ion-navbar>
    <ion-title>
      Ionic Blank
    </ion-title>
  </ion-navbar>
</ion-header>

<ion-content padding>
  The world is your oyster.
  <p>
    If you get lost, the <a href="http://ionicframework.com/docs/v2">docs</a> will be your guide.
  </p>
  <button ion-button (click)="clickMe()">Go to Tabs</button>
</ion-content>

  `
})
export class HomePage {

  constructor(public navCtrl: NavController) {
  }

  clickMe() {
    this.navCtrl.push('TabsPage', { paramOne: 'ParamOneData', paramTwo: 'ParamTwoData'});
  }

}

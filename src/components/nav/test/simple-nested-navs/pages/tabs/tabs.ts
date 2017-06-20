import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '../../../../../..';

@IonicPage({
  segment: 'toot/:paramOne/beep/:paramTwo'
})
@Component({
  template: `
  <ion-tabs>
    <ion-tab tabIcon="heart" [root]="tab1" tabTitle="Taco Burrito Enchilada"></ion-tab>
    <ion-tab tabIcon="star" [root]="tab2"></ion-tab>
  </ion-tabs>
  `
})
export class TabsPage {
  tab1 = 'FirstPage';
  tab2 = 'SecondPage';

  constructor(public nav: NavController, public params: NavParams) {

  }

  ionViewDidEnter() {
    console.log('paramOne: ', this.params.data.paramOne);
    console.log('paramTwo: ', this.params.data.paramTwo);
  }

}
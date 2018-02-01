import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '../../../../../../..';

@IonicPage({
  segment: 'TabsTwoTabOnePageThree/paramOne/:paramOne/paramTwo/:paramTwo',
  defaultHistory: ['TabsTwoTabOnePageOne']
})
@Component({
  template: `
<ion-header>
  <ion-navbar>
    <ion-title>Tabs 2 Tab 1 Page 3</ion-title>
  </ion-navbar>
</ion-header>
<ion-content>
  Tabs 2 Tab 1 Page 3
  <div>
  Param One: {{paramOne}}
  </div>
  <div>
  Param Two: {{paramTwo}}
  </div>
</ion-content>
  `
})
export class TabsTwoTabOnePageThree {
  paramOne: string;
  paramTwo: string;
  constructor(public nav: NavController, navParams: NavParams) {
    this.paramOne = navParams.data.paramOne;
    this.paramTwo = navParams.data.paramTwo;
  }
}

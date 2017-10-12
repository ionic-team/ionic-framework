import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '../../../../../../..';

@IonicPage({
  segment: 'TabsOneTabOnePageThree/paramOne/:paramOne/paramTwo/:paramTwo'
})
@Component({
  template: `
<ion-header>
  <ion-navbar>
    <ion-title>Tabs 1 Tab 1 Page 3</ion-title>
  </ion-navbar>
</ion-header>
<ion-content>
  Tabs 1 Tab 1 Page 3
  <div>
  Param One: {{paramOne}}
  </div>
  <div>
  Name: {{paramTwo}}
  </div>
</ion-content>
  `
})
export class TabsOneTabOnePageThree {
  paramOne: string;
  paramTwo: string;
  constructor(public nav: NavController, navParams: NavParams) {
    this.paramOne = navParams.data.paramOne;
    this.paramTwo = navParams.data.paramTwo;
  }
}

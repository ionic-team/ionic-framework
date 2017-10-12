import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '../../../../../../..';

@IonicPage({
  segment: 'TabsOneTabTwoPageThree/paramOne/:paramOne/paramTwo/:paramTwo'
})
@Component({
  template: `
<ion-header>
  <ion-navbar>
    <button ion-button menuToggle>
      <ion-icon name="menu"></ion-icon>
    </button>
    <ion-title>Tabs 1 Tab 2 Page 3</ion-title>
  </ion-navbar>
</ion-header>
<ion-content>
  Tabs 1 Tab 2 Page 3
  <div>
  Param One: {{userId}}
  </div>
  <div>
  Param Two: {{name}}
  </div>
</ion-content>
  `
})
export class TabsOneTabTwoPageThree {
  paramOne: string;
  paramTwo: string;
  constructor(public nav: NavController, navParams: NavParams) {
    this.paramOne = navParams.data.paramOne;
    this.paramTwo = navParams.data.paramTwo;
  }
}

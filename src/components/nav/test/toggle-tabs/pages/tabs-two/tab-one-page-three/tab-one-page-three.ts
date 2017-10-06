import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '../../../../../../..';

@IonicPage({
  segment: 'TabsTwoTabOnePageThree/paramOne/:paramOne/paramTwo/:paramTwo'
})
@Component({
  template: `
<ion-header>
  <ion-navbar>
    <button ion-button menuToggle>
      <ion-icon name="menu"></ion-icon>
    </button>
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

import { Component } from '@angular/core';
import { IonicPage, NavController, } from '../../../../../../..';

@IonicPage()
@Component({
  template: `
    <ion-tabs>
      <ion-tab tabIcon="heart" [root]="tabs1Tab1" tabTitle="Heart"></ion-tab>
      <ion-tab tabIcon="star" [root]="tabs1Tab2" tabTitle="Star"></ion-tab>
    </ion-tabs>
  `
})
export class TabOnePage {

  tabs1Tab1 = 'TabsOneTabOnePageOne';
  tabs1Tab2 = 'TabsOneTabTwoPageOne';

  constructor(public nav: NavController) {
  }
}

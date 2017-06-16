import { Component } from '@angular/core';
import { IonicPage, NavController, } from '../../../../../../..';

@IonicPage()
@Component({
  template: `
    <ion-tabs>
    <ion-tab tabIcon="aperture" [root]="tabs2Tab1" tabTitle="Aperture"></ion-tab>
    <ion-tab tabIcon="apps" [root]="tabs2Tab2" tabTitle="Apps"></ion-tab>
  </ion-tabs>
  `
})
export class TabTwoPage {

  tabs2Tab1 = 'TabsTwoTabOnePageOne';
  tabs2Tab2 = 'TabsTwoTabTwoPageOne';

  constructor(public nav: NavController) {
  }
}

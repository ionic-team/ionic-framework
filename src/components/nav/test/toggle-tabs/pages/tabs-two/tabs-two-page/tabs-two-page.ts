import { Component } from '@angular/core';
import { IonicPage, NavController, } from '../../../../../../..';

@IonicPage({
  segment: 'TabsTwoPage'
})
@Component({
  template: `
<ion-tabs name="second-tabs">
  <ion-tab tabIcon="aperture" [root]="tabs2Tab1" tabTitle="Aperture"></ion-tab>
  <ion-tab tabIcon="apps" [root]="tabs2Tab2" tabTitle="Apps"></ion-tab>
</ion-tabs>
  `
})
export class TabsTwoPage {

  tabs2Tab1: string = 'TabsTwoTabOnePageOne';
  tabs2Tab2: string = 'TabsTwoTabTwoPageOne';
  constructor(public nav: NavController) {
  }
}

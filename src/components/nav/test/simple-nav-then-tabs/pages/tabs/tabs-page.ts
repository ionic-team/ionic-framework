import { Component } from '@angular/core';
import { IonicPage, } from '../../../../../..';

@IonicPage()
@Component({
  template: `
  <ion-tabs name="app">
    <ion-tab tabIcon="heart" [root]="tab1" tabTitle="Taco Burrito Enchilada"></ion-tab>
    <ion-tab tabIcon="star" [root]="tab2" tabTitle="Tab 2" tabUrlPath="ABC123"></ion-tab>
  </ion-tabs>
  `
})
export class TabsPage {
  tab1 = 'FirstPage';
  tab2 = 'FourthPage';
}

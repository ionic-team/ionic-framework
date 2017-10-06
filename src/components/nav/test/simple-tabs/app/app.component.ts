import { Component } from '@angular/core';

@Component({
  template: `
  <ion-tabs name="simple">
    <ion-tab tabIcon="heart" [root]="tab1" tabTitle="Taco Burrito Enchilada"></ion-tab>
    <ion-tab tabIcon="star" [root]="tab2" tabTitle="Tab 2" tabUrlPath="ABC123"></ion-tab>
  </ion-tabs>
  `
})
export class AppComponent {
  tab1 = 'FirstPage';
  tab2 = 'FourthPage';
}

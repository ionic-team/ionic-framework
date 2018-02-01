import { Component } from '@angular/core';

@Component({
  template: `
<ion-split-pane>
  <ion-tabs>
    <ion-tab tabIcon="heart" [root]="tabs1Tab1" tabTitle="Heart"></ion-tab>
    <ion-tab tabIcon="star" [root]="tabs1Tab2" tabTitle="Star"></ion-tab>
  </ion-tabs>
  <ion-tabs>
    <ion-tab tabIcon="aperture" [root]="tabs2Tab1" tabTitle="Aperture"></ion-tab>
    <ion-tab tabIcon="apps" [root]="tabs2Tab2" tabTitle="Apps"></ion-tab>
  </ion-tabs>
</ion-split-pane>
  `
})
export class AppComponent {
  tabs1Tab1 = 'TabsOneTabOnePageOne';
  tabs1Tab2 = 'TabsOneTabTwoPageOne';
  tabs2Tab1 = 'TabsTwoTabOnePageOne';
  tabs2Tab2 = 'TabsTwoTabTwoPageOne';
}

  import {App, IonicView, NavController} from 'ionic/ionic';

//
// Tab 1
//
@IonicView({
  template: `
    <ion-navbar *navbar>
      <ion-title>Heart</ion-title>
    </ion-navbar>
    <ion-content padding>
      <h2>Tab 1</h2>
    </ion-content>
    `
})
class Tab1 {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}

//
// Tab 2
//
@IonicView({
  template: `
    <ion-navbar *navbar>
      <ion-title>Star</ion-title>
    </ion-navbar>
    <ion-content padding>
      <h2>Tab 2</h2>
    </ion-content>
    `
})
class Tab2 {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}

//
// Tab 3
//
@IonicView({
  template: `
    <ion-navbar *navbar>
      <ion-title>Stopwatch</ion-title>
    </ion-navbar>
    <ion-content padding>
      <h2>Tab 3</h2>
    </ion-content>
    `
})
class Tab3 {
  constructor(nav: NavController) {
    this.nav = nav;
  }
}

@App({
  template: `
    <ion-tabs>
      <ion-tab tab-title="Heart" tab-icon="heart" [root]="root1"></ion-tab>
      <ion-tab tab-title="Star" tab-icon="star" [root]="root2"></ion-tab>
      <ion-tab tab-title="Stopwatch" tab-icon="stopwatch" [root]="root3"></ion-tab>
    </ion-tabs>
    `
})
export class TabsPage {
  constructor() {
    this.root1 = Tab1;
    this.root2 = Tab2;
    this.root3 = Tab3;
  }
}

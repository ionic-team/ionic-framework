import {Validators, Control, ControlGroup} from 'angular2/common';
import {App, Page, NavController} from 'ionic-angular';


@Page({
  templateUrl: 'main.html',
})
class SegmentPage {
  constructor(nav: NavController) {
    this.nav = nav;
    this.signInType = 'new';
  }

  goToPage2() {
    this.nav.push(SegmentPage2);
  }
}

@Page({
  template: `
    <ion-navbar *navbar hideBackButton>
      <button menuToggle>
        <ion-icon name="menu"></ion-icon>
      </button>
      <ion-title>
        Second Page
      </ion-title>
    </ion-navbar>

    <ion-content>
      <h1>Page 2</h1>
    </ion-content>
  `
})
class SegmentPage2 {
  constructor() {
  }
}


@App({
  pages: [SegmentPage],
  template: `<ion-nav [root]="root"></ion-nav>`
})
class MyApp {
  constructor() {
    this.root = SegmentPage;
  }
}

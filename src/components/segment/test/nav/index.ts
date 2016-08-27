import { Component } from '@angular/core';
import { ionicBootstrap, NavController } from '../../../../../src';


@Component({
  templateUrl: 'main.html',
})
class SegmentPage {
  signInType: string;

  constructor(public navCtrl: NavController) {
    this.signInType = 'new';
  }

  goToPage2() {
    this.navCtrl.push(SegmentPage2);
  }
}

@Component({
  template: `
    <ion-header>
      <ion-navbar hideBackButton>
        <button ion-button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>
          Second Page
        </ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content>
      <h1>Page 2</h1>
    </ion-content>
  `
})
class SegmentPage2 {}


@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
class E2EApp {
  root = SegmentPage;
}

ionicBootstrap(E2EApp);

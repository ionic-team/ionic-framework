import {Component} from '@angular/core';
import {Validators, Control, ControlGroup} from '@angular/common';
import {ionicBootstrap, NavController} from '../../../../../src';


@Component({
  templateUrl: 'main.html',
})
class SegmentPage {
  signInType: string;

  constructor(public nav: NavController) {
    this.signInType = 'new';
  }

  goToPage2() {
    this.nav.push(SegmentPage2);
  }
}

@Component({
  template: `
    <ion-header>
      <ion-navbar hideBackButton>
        <button menuToggle>
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
class SegmentPage2 {
  constructor() {
  }
}


@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
class E2EApp {
  root = SegmentPage;
}

ionicBootstrap(E2EApp);

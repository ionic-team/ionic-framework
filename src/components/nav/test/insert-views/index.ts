import { Component} from '@angular/core';
import { ionicBootstrap, NavController } from '../../../../../src';


@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Root</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content padding>
      <button block (click)="pushPage()">Push Page</button>
    </ion-content>`,
})
class FirstPage {
  constructor(public nav: NavController) {}

  pushPage() {
    this.nav.push(SecondPage)
  }
}


@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Root</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content padding>
      <h1>Second page</h1>
      <button block (click)="insertPage()">Insert Page</button>
    </ion-content>
  `
})
class SecondPage {
  constructor(public nav: NavController) {}

  insertPage() {
    this.nav.insert(1, InsertPage)
  }
}


@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Inserted Paged</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>
      Inserted Page
    </ion-content>
  `
})
class InsertPage {}


@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
class E2EApp {
  root = FirstPage;
}

ionicBootstrap(E2EApp);

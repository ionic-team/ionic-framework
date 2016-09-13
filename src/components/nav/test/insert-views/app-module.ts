import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, NavController } from '../../../..';


@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Root</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content padding>
      <button ion-button block (click)="pushPage()">Push Page</button>
    </ion-content>`,
})
export class FirstPage {
  constructor(public navCtrl: NavController) {}

  pushPage() {
    this.navCtrl.push(SecondPage);
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
      <button ion-button block (click)="insertPage()">Insert Page</button>
    </ion-content>
  `
})
export class SecondPage {
  constructor(public navCtrl: NavController) {}

  insertPage() {
    this.navCtrl.insert(1, InsertPage);
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
export class InsertPage {}


@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
export class E2EApp {
  root = FirstPage;
}

@NgModule({
  declarations: [
    E2EApp,
    FirstPage,
    SecondPage,
    InsertPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    FirstPage,
    SecondPage,
    InsertPage
  ]
})
export class AppModule {}

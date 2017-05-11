import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, NavController, AlertController } from '../../../..';

//
// Tab 1
//
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Lifecyles</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content padding>
      <p>ionViewCanEnter ({{called.ionViewCanEnter}})</p>
      <p>ionViewCanLeave ({{called.ionViewCanLeave}})</p>
      <p>ionViewWillLoad ({{called.ionViewWillLoad}})</p>
      <p>ionViewDidLoad ({{called.ionViewDidLoad}})</p>
      <p>ionViewWillEnter ({{called.ionViewWillEnter}})</p>
      <p>ionViewDidEnter ({{called.ionViewDidEnter}})</p>
      <p>ionViewWillLeave ({{called.ionViewWillLeave}})</p>
      <p>ionViewDidLeave ({{called.ionViewDidLeave}})</p>

      <button ion-button (click)="push()">push()</button>
      <button ion-button (click)="openAlert()">open alert</button>
    </ion-content>
    `
})
export class Tab1 {
  called: any;

  constructor(private alertCtrl: AlertController, private navCtrl: NavController) {
    this.called = {
      ionViewCanEnter: 0,
      ionViewCanLeave: 0,
      ionViewWillLoad: 0,
      ionViewDidLoad: 0,
      ionViewWillEnter: 0,
      ionViewDidEnter: 0,
      ionViewWillLeave: 0,
      ionViewDidLeave: 0
    };
  }

  push() {
    this.navCtrl.push(Tab1);
  }

  openAlert() {
    this.alertCtrl.create({
      title: 'Example'
    }).present();
  }

  ionViewCanEnter() {
    this.called.ionViewCanEnter++;
    return true;
  }

  ionViewCanLeave() {
    this.called.ionViewCanLeave++;
    return true;
  }

  ionViewWillLoad() {
    this.called.ionViewWillLoad++;
  }

  ionViewDidLoad() {
    this.called.ionViewDidLoad++;
  }

  ionViewWillEnter() {
    this.called.ionViewWillEnter++;
  }

  ionViewDidEnter() {
    this.called.ionViewDidEnter++;
  }

  ionViewWillLeave() {
    this.called.ionViewWillLeave++;
  }

  ionViewDidLeave() {
    this.called.ionViewDidLeave++;
  }
}

@Component({
  template: `
    <ion-tabs>
      <ion-tab tabTitle="Plain List" tabIcon="star" [root]="root"></ion-tab>
      <ion-tab tabTitle="Schedule" tabIcon="globe" [root]="root"></ion-tab>
      <ion-tab tabTitle="Stopwatch" tabIcon="logo-facebook" [root]="root"></ion-tab>
    </ion-tabs>
  `
})
export class TabsPage {
  root = Tab1;
}

@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
export class AppComponent {
  root = TabsPage;
}

@NgModule({
  declarations: [
    AppComponent,
    Tab1,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent, {
      tabsHighlight: true,
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    Tab1,
    TabsPage
  ]
})
export class AppModule {}

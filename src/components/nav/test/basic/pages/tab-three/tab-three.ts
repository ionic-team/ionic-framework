import { Component } from '@angular/core';
import { AlertController, App, IonicPage, Tabs } from '../../../../../..';

@IonicPage({
  name: 'tab-three'
})
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <button ion-button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>Stopwatch</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content padding>
      <h2>Tab 3</h2>
      <p>
        <button ion-button (click)="presentAlert()">Present Alert</button>
        <button ion-button (click)="presentModal()">Present Modal</button>
      </p>
      <p>
        <button ion-button (click)="selectPrevious()">Select Previous Tab</button>
      </p>
      <p>
        <button ion-button (click)="appNavPop()">App Nav Pop</button>
      </p>
    </ion-content>
    `
})
export class Tab3 {
  constructor(private alertCtrl: AlertController, private tabs: Tabs, private app: App) {}

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Alert Title!',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  presentModal() {
    console.debug('modal was commented out');
    // this.modalCtrl.create(MyModal).present();
  }

  selectPrevious() {
    this.tabs.select(this.tabs.previousTab());
  }

  appNavPop() {
    this.app.navPop();
  }
}

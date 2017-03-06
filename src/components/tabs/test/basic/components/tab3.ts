import { Component } from '@angular/core';
import { App, AlertController, ModalController, Tabs } from '../../../../..';

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
        <button ion-button (click)="appNavPop()">App Nav Pop</button>
      </p>

      <ion-list [virtualScroll]="items">

        <ion-item *virtualItem="let item">
          Item: {{item}}
        </ion-item>

      </ion-list>

    </ion-content>
    `
})
export class Tab3 {
  items: number[] = [];

  constructor(private alertCtrl: AlertController, private modalCtrl: ModalController, private tabs: Tabs, private app: App) {
    for (var i = 0; i < 100; i++) {
      this.items.push(i);
    }
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Alert Title!',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  presentModal() {
    this.modalCtrl.create('MyModal').present();
  }

  selectPrevious() {
    this.tabs.select(this.tabs.previousTab());
  }

  appNavPop() {
    this.app.navPop();
  }
}

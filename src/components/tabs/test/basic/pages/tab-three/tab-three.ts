import { Component } from '@angular/core';
import { AlertController, App, IonicPage, ModalController, Tabs } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'tab-three.html'
})
export class TabThree {
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
    this.modalCtrl.create('ModalPage').present();
  }

  selectPrevious() {
    this.tabs.select(this.tabs.previousTab());
  }

  appNavPop() {
    this.app.navPop();
  }
}

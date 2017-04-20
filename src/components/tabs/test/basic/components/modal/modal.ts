import { Component } from '@angular/core';
import { App, ViewController } from '../../../../../..';

@Component({
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-buttons start>
        <button ion-button (click)="dismiss()">Cancel</button>
      </ion-buttons>

      <ion-title>
        Filter Sessions
      </ion-title>

      <ion-buttons end>
        <button ion-button (click)="dismiss()">Done</button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="outer-content">
    <ion-list>
      <ion-list-header>Tracks</ion-list-header>

      <ion-item *ngFor="let i of items">
        <ion-label>Toggle {{i}}</ion-label>
        <ion-toggle color="secondary"></ion-toggle>
      </ion-item>
    </ion-list>

    <ion-list>
      <button ion-item color="danger" detail-none>
        Reset All Filters
      </button>
      <button ion-item color="danger" detail-none (click)="appNavPop()">
        App Nav Pop
      </button>
    </ion-list>
  </ion-content>
  `
})
export class MyModal {
  items: any[] = [];

  constructor(private viewCtrl: ViewController, private app: App) {
    for (var i = 1; i <= 10; i++) {
      this.items.push(i);
    }
  }

  dismiss() {
    // using the injected ViewController this page
    // can "dismiss" itself and pass back data
    this.viewCtrl.dismiss();
  }

  appNavPop() {
    this.app.navPop();
  }
}

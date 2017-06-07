import { Component } from '@angular/core';
import { App, IonicPage, NavController, Tabs } from '../../../../../..';

@IonicPage({
  name: 'tab-one'
})
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>Heart</ion-title>
      </ion-navbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-list-header>
          Tab 1
        </ion-list-header>
        <ion-item>
          <button ion-button (click)="goBack()">Back</button>
        </ion-item>
        <ion-item (click)="goTo()" *ngFor="let i of items">Item {{i}} {{i}} {{i}} {{i}}</ion-item>
      </ion-list>
      <p>
        <button ion-button (click)="selectPrevious()">Select Previous Tab</button>
      </p>
      <p>
        <button ion-button (click)="appNavPop()">App Nav Pop</button>
      </p>
    </ion-content>
    `
})
export class Tab1 {
  items: any[] = [];

  constructor(private tabs: Tabs, private app: App, private nav: NavController) {
    for (var i = 1; i <= 250; i++) {
      this.items.push(i);
    }
  }

  goBack() {
    this.nav.parent.parent.pop();
  }

  goTo() {
    this.nav.push('tab-item-page');
  }

  selectPrevious() {
    this.tabs.select(this.tabs.previousTab());
  }

  appNavPop() {
    this.app.navPop();
  }
}

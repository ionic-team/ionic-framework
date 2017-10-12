import { Component, ViewChild } from '@angular/core';
import { NavController } from '../../../../..';
@Component({
  template: `
  <ion-menu [content]="content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <button ion-item (click)="goToTabsOne()" menuClose>
          Tabs One
        </button>
        <button ion-item (click)="goToTabsTwo()" menuClose>
          Tabs Two
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav [root]="root" #content name="rootNav"></ion-nav>`
})
export class AppComponent {
  root = 'RootPage';

  @ViewChild('content') nav: NavController;

  goToTabsOne() {
    this.nav.setRoot('TabsOnePage');
  }

  goToTabsTwo() {
    this.nav.setRoot('TabsTwoPage');
  }
}

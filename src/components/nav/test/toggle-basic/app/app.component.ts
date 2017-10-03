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
          Page One
        </button>
        <button ion-item (click)="goToTabsTwo()" menuClose>
          Page Four
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
    this.nav.setRoot('FirstPage');
  }

  goToTabsTwo() {
    this.nav.setRoot('FourthPage');
  }
}

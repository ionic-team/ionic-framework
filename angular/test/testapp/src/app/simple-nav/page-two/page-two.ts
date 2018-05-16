import { Component, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'page-two',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Page Two</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Page Two
      <div>
        <ion-button routerLink="/simple-nav/page-three/paramOne/paramTwo">Go to Page Three</ion-button>
      </div>
      <div>
        <ion-button routerLink="/simple-nav/page-one" goBack>Go to Page One</ion-button>
      </div>

      <ion-list>
        <ion-item href="/simple-nav/page-one" routerDirection="forward">
          FORWARD (Page one)
        </ion-item>

        <ion-item href="/simple-nav/page-one" routerDirection="back">
          BACK (Page one)
        </ion-item>

        <ion-item href="/simple-nav/page-one" routerDirection="root">
          ROOT (Page one)
        </ion-item>
      </ion-list>
    </ion-content>
  `
})
export class PageTwo {

}

import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import { PageThree } from '../page-three/page-three';

@Component({
  selector: 'page-two',
  template: `
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Page Two</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Page Two
      <ion-button (click)="navPush()">Go to Page Three</ion-button>
      <ion-button (click)="navPop()">Pop to Page Two</ion-button>
    </ion-content>
  </ion-page>
  `
})
export class PageTwo {

  constructor(private navController: NavController) {
  }


  navPush() {
    this.navController.push('/page-three');
  }

  navPop() {
    this.navController.pop();
  }

}

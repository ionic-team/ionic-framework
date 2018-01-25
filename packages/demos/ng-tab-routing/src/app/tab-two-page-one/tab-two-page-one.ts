import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'tab-two-page-one',
  template: `
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab Two Page One</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Tab Two Page One {{ts}}
    </ion-content>
  </ion-page>
  `
})
export class TabTwoPageOne {

  ts: number;
  constructor(/*private navController: NavController*/private router: Router) {
    setInterval(() => {
      this.ts = Date.now();
    }, 500);
  }

}

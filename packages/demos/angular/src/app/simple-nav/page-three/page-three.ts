import { Component, ViewEncapsulation } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';

@Component({
  selector: 'page-three',
  template: `
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Page Three</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Page Three {{ts}}
      <div>isProd: {{isProd}}</div>
      <div>paramOne: {{paramOne}}</div>
      <div>paramTwo: {{paramTwo}}</div>
      <div>
        <ion-button (click)="navPop()">Go Back</ion-button>
      </div>
    </ion-content>
  </ion-page>
  `
})
export class PageThree {

  ts: number;
  isProd = false;
  paramOne: any = null;
  paramTwo: any = null;
  constructor(private navController: NavController, private navParams: NavParams) {

    this.isProd = navParams.get('isProd');
    this.paramOne = navParams.get('paramOne');
    this.paramTwo = navParams.get('paramTwo');

    setInterval(() => {
      this.ts = Date.now();
    }, 500);
  }


  navPop() {
    this.navController.pop();
  }

}

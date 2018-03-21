import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'page-three',
  template: `
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
      <ion-button>Go Back</ion-button>
    </div>
  </ion-content>
  `
})
export class PageThree {

  ts: number;
  isProd = false;
  paramOne: any = null;
  paramTwo: any = null;

  // constructor(private navController: NavController, private navParams: NavParams) {

  //   this.isProd = navParams.get('isProd');
  //   this.paramOne = navParams.get('paramOne');
  //   this.paramTwo = navParams.get('paramTwo');

  //   setInterval(() => {
  //     this.ts = Date.now();
  //   }, 500);
  // }

}

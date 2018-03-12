import { Component, ViewEncapsulation } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'login',
  template: `
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login Page</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Login - {{ts}}
      <div>
        <ion-button (click)="pushPageTwoComponent()">Login to app</ion-button>
      </div>
    </ion-content>
  </ion-page>
  `
})
export class LoginPage {

  ts: number;
  constructor(private navController: NavController) {
    setInterval(() => {
      this.ts = Date.now();
    }, 500);
  }


  pushPageTwoComponent() {
    this.navController.push('/nav-then-tabs/app/tabs/(tab-one:one)');
  }



}

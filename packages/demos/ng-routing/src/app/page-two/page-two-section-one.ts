import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'page-two-section-one',
  template: `
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Page Two Section One</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Page Two Section One - TS {{ts}}
      <ion-button (click)="pushPageTwoComponent()">Go to Section Two</ion-button>
      <ion-button (click)="goBack()">Go Back</ion-button>
    </ion-content>
  </ion-page>
  `
})
export class PageTwoSectionOne {

  ts: number;

  constructor(/*private navController: NavController*/private router: Router) {
    setInterval(() => {
      this.ts = Date.now();
    }, 500);
  }

  pushPageTwoComponent() {
    this.router.navigateByUrl('/page-two/section-two');
  }

  goBack() {
    this.router.navigateByUrl('/page-one');
  }
}

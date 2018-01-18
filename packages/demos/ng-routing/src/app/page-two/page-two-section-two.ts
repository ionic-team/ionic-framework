import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'page-two-section-two',
  template: `
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Page Two Section Two</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Page Two Section Two
      <ion-button (click)="pushPageTwoComponent()">Go to Page Three</ion-button>
      <ion-button (click)="goBack()">Go Back</ion-button>
    </ion-content>
  </ion-page>
  `
})
export class PageTwoSectionTwo {

  constructor(/*private navController: NavController*/private router: Router) {
  }

  pushPageTwoComponent() {
    this.router.navigateByUrl('/page-three');
  }

  goBack() {
    this.router.navigateByUrl('/page-two/section-one');
  }
}

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
      Page Two Section One
      <ion-button (click)="pushPageTwoComponent()">Go to Section Two</ion-button>
    </ion-content>
  </ion-page>
  `
})
export class PageTwoSectionOne {

  constructor(/*private navController: NavController*/private router: Router) {
  }

  pushPageTwoComponent() {
    this.router.navigateByUrl('/page-two/section-two');
  }

}

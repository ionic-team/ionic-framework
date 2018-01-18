import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import { PageTwo } from '../page-two/page-two';

@Component({
  selector: 'page-one',
  template: `
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Page One</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Page One
      <ion-button (click)="pushPageTwoComponent()">Go to Page Two</ion-button>
      <a [routerLink]="[ '/page-two/section-one']">Go To Page Two</a>
    </ion-content>
  </ion-page>
  `
})
export class PageOne {

  constructor(/*private navController: NavController*/private router: Router) {
  }


  pushPageTwoComponent() {
    // this.navController.push('/page-two');
    this.router.navigateByUrl('/page-two/section-one');
  }

}

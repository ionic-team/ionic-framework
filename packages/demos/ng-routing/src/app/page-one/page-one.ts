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
    </ion-content>
  </ion-page>
  `
})
export class PageOne {

  constructor(private navController: NavController) {
  }


  pushPageTwoComponent() {
    this.navController.push('/page-two');
  }

}

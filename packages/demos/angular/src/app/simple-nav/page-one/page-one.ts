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
        <ion-title>Simple Page One</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Page One - {{ts}}
      <div>
        <ion-button (click)="pushPageTwoComponent()">Go to Page Two</ion-button>
      </div>
    </ion-content>
  </ion-page>
  `
})
export class PageOne {

  ts: number;
  constructor(private router: Router, private navController: NavController) {
    setInterval(() => {
      this.ts = Date.now();
    }, 500);
  }


  pushPageTwoComponent() {
    //this.router.navigateByUrl('/simple-nav/page-two');
    this.navController.element.updateUrl('/simple-nav/page-two');
  }



}

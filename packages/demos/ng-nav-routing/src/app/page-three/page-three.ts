import { Component, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@danbucholtz/ng-router';
import { NavController } from '@ionic/angular';

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
      <div>
        <ion-button (click)="navPop()">Go Back</ion-button>
      </div>
    </ion-content>
  </ion-page>

  <!-- <div>
    <h1>Page One</h1>
    <div>
      <button (click)="navPop()">Go Back</button>
    </div>
  </div> -->
  `
})
export class PageThree {

  ts: number;
  constructor(/*private navController: NavController*/private router: Router, private location: Location) {

    setInterval(() => {
      this.ts = Date.now();
    }, 500);
  }


  navPop() {
    // this.navController.pop();
    // this.router.navigateByUrl('/page-two/section-two');
    window.history.back();
  }

}

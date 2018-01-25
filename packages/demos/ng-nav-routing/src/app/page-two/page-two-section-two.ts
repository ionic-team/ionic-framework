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
      Page Two Section Two {{ts}}
      <div>
        <ion-button (click)="pushPageTwoComponent()">Go to Page Three</ion-button>
      </div>
      <div>
        <ion-button (click)="goBack()">Go Back</ion-button>
      </div>
    </ion-content>
  </ion-page>

  <!-- <div>
    <h2>Page Two Section Two</h2>
    <button (click)="pushPageTwoComponent()">Go to Page Three</button>
    <button (click)="goBack()">Go Back</button>
  </div> -->
  `
})
export class PageTwoSectionTwo {

  ts: number;
  constructor(/*private navController: NavController*/private router: Router) {
    setInterval(() => {
      this.ts = Date.now();
    }, 500);
  }

  pushPageTwoComponent() {
    this.router.navigateByUrl('/page-three');
  }

  goBack() {
    this.router.navigateByUrl('/page-two/section-one');
  }
}

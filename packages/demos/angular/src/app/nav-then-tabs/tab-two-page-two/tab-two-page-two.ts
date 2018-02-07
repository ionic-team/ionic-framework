import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tab-two-page-two',
  template: `
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab Two Page Two</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Tab Two Page Two {{ts}}
      <div>
        <ion-button (click)="next()">Go to Page Three</ion-button>
      </div>
      <div>
        <ion-button (click)="back()">Go Back</ion-button>
      </div>
    </ion-content>
  </ion-page>
  `
})
export class TabTwoPageTwo {

  ts: number;
  constructor(private router: Router) {
    setInterval(() => {
      this.ts = Date.now();
    }, 500);
  }

  next() {
    this.router.navigateByUrl('/nav-then-tabs/app/tabs/(tab-two:three)');
  }

  back() {
    this.router.navigateByUrl('/nav-then-tabs/app/tabs/(tab-two:one)');
  }
}

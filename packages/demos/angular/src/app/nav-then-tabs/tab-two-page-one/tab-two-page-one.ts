import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'tab-two-page-one',
  template: `
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab Two Page One</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Tab Two Page One {{ts}}
      <div>
        <ion-button (click)="next()">Go to Page Two</ion-button>
      </div>
    </ion-content>
  </ion-page>
  `
})
export class TabTwoPageOne {

  ts: number;
  constructor(private router: Router) {
    setInterval(() => {
      this.ts = Date.now();
    }, 500);
  }

  next() {
    this.router.navigateByUrl('/nav-then-tabs/app/tabs/(tab-two:two)');
  }
}

import { Component, ViewEncapsulation } from '@angular/core';
import { PageTwo } from '../page-two/page-two';

@Component({
  selector: 'page-one',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Simple Page One</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Page One - {{ts}}
      <div>
        <ion-button [routerLink]="['/simple-nav/page-two']">Go to Page Two</ion-button>
      </div>
    </ion-content>
  `
})
export class PageOne {

  ts: number;
  constructor() {
    setInterval(() => {
      this.ts = Date.now();
    }, 500);
  }
}

import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@danbucholtz/ng-router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'tab-three-page-one',
  template: `
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab Three Page One</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Tab Three Page One {{ts}}
      <div>
        <ion-button (click)="next()">Go to Page Two</ion-button>
      </div>
    </ion-content>
  </ion-page>
  `
})
export class TabThreePageOne {

  ts: number;
  constructor(/*private navController: NavController*/private router: Router) {
    setInterval(() => {
      this.ts = Date.now();
    }, 500);
  }

  next() {
    this.router.navigateByUrl('/app/tabs/(tab-three:two)');
  }
}

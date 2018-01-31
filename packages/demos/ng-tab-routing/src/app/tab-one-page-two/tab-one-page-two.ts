import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@danbucholtz/ng-router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'tab-one-page-two',
  template: `
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab One Page Two</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Tab One Page Two {{ts}}
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
export class TabOnePageTwo {

  ts: number;
  constructor(/*private navController: NavController*/private router: Router) {
    setInterval(() => {
      this.ts = Date.now();
    }, 500);
  }

  next() {
    this.router.navigateByUrl('/app/tabs/(tab-one:three)');
  }

  back() {
    this.router.navigateByUrl('/app/tabs/(tab-one:one)');
  }
}

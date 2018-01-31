import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@danbucholtz/ng-router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'tab-one-page-three',
  template: `
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab One Page Three</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Tab One Page Three {{ts}}
      <div>
        <ion-button (click)="back()">Go Back</ion-button>
      </div>
    </ion-content>
  </ion-page>
  `
})
export class TabOnePageThree {

  ts: number;
  constructor(/*private navController: NavController*/private router: Router) {
    setInterval(() => {
      this.ts = Date.now();
    }, 500);
  }

  back() {
    this.router.navigateByUrl('/app/tabs/(tab-one:two)');
  }
}

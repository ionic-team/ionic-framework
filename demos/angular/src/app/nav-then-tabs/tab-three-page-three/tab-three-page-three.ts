import { Component, ViewEncapsulation } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'tab-three-page-three',
  template: `
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab Three Page Three</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Tab Three Page Three {{ts}}
      <div>
        <ion-button (click)="back()">Go Back</ion-button>
      </div>
    </ion-content>
  </ion-page>
  `
})
export class TabThreePageThree {

  ts: number;
  constructor(private navController: NavController) {
    setInterval(() => {
      this.ts = Date.now();
    }, 500);
  }

  back() {
    this.navController.pop();
  }
}

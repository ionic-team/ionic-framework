import { Component, ViewEncapsulation } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'tab-three-page-two',
  template: `
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab Three Page Two</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Tab Three Page Two {{ts}}
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
export class TabThreePageTwo {

  ts: number;
  constructor(private navController: NavController) {
    setInterval(() => {
      this.ts = Date.now();
    }, 500);
  }

  next() {
    this.navController.element.pushUrl('/nav-then-tabs/app/tabs/(tab-three:three)');
  }

  back() {
    this.navController.element.popUrl();
  }
}

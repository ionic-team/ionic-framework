import { Component, ViewEncapsulation } from '@angular/core';
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
  constructor(private navController: NavController) {
    setInterval(() => {
      this.ts = Date.now();
    }, 500);
  }

  next() {
    this.navController.element.pushUrl('/nav-then-tabs/app/tabs/(tab-three:two)');
  }
}

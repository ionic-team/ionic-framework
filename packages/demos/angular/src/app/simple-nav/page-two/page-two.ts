import { Component, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'page-two',
  template: `
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Page Two</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Page Two - {{ts}}
      <div>
        <ion-button (click)="pushPageThreeComponent()">Go to Page Three</ion-button>
      </div>
      <div>
        <ion-button (click)="goBack()">Go Back</ion-button>
      </div>
    </ion-content>
  </ion-page>
  `
})
export class PageTwo {

  constructor(private navController: NavController) {
  }

  pushPageThreeComponent() {
    this.navController.push('/simple-nav/page-three');
  }

  goBack() {
    this.navController.pop();
  }
}

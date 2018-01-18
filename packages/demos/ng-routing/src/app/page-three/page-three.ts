import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'page-three',
  template: `
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Page Three</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Page Three
      <ion-button (click)="navPop()">Go Back</ion-button>
    </ion-content>
  </ion-page>
  `
})
export class PageThree {

  constructor(/*private navController: NavController*/private router: Router) {
  }


  navPop() {
    // this.navController.pop();
    this.router.navigateByUrl('/page-two/section-two');
  }

}

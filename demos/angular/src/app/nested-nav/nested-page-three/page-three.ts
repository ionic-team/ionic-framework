import { Component, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
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
      Page Three {{ts}}
      <div>
        <ion-button (click)="navPop()">Go Back</ion-button>
      </div>
    </ion-content>
  </ion-page>
  `
})
export class PageThree {

  ts: number;
  constructor(private router: Router, private location: Location) {

    setInterval(() => {
      this.ts = Date.now();
    }, 500);
  }


  navPop() {
    window.history.back();
  }

}

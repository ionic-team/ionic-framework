import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-three',
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button></ion-back-button>
      </ion-buttons>
      <ion-title>Page Three</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content padding>
    <div>paramOne: {{paramOne}}</div>
    <div>paramTwo: {{paramTwo}}</div>
    <div>
      <ion-button [routerLink]="['/simple-nav/page-one']">Go to Page One</ion-button>
    </div>
    <div>
      <ion-button [routerLink]="['/simple-nav/page-two']">Go to Page Two</ion-button>
    </div>
  </ion-content>
  `
})
export class PageThree {

  paramOne: any = null;
  paramTwo: any = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
       this.paramOne = params['paramOne'];
       this.paramTwo = params['paramTwo'];
    });
  }

}

import { Component } from '@angular/core';

import { PageTwo } from './page-two';

@Component({
  selector: 'page-one',
  template: `
<ion-page>
  <ion-header>
    <ion-toolbar>
      <ion-title>Page One</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    Page One
    <div>
      <ion-button (click)="goToPageTwo()">Go to Page Two</ion-button>
    </div>
    <ul>
      <li>ngOnInit - {{ngOnInitDetection}}</li>
      <li>ionViewWillEnter - {{ionViewWillEnterDetection}}</li>
      <li>ionViewDidEnter - {{ionViewDidEnterDetection}}</li>
    </ul>
  </ion-content>
</ion-page>
  `
})
export class PageOne {

  ngOnInitDetection = 'initial';
  ionViewWillEnterDetection = 'initial';
  ionViewDidEnterDetection = 'initial';

  constructor() {

  }


  ngOnInit() {
    console.log('page one ngOnInit');
    setInterval(() => {
      this.ngOnInitDetection = '' + Date.now();
    }, 500);
  }

  ionViewWillEnter() {
    console.log('page one ionViewWillEnter');
    setInterval(() => {
      this.ionViewWillEnterDetection = '' + Date.now();
    }, 500);
  }

  ionViewDidEnter() {
    console.log('page one ionViewDidEnter');
    setInterval(() => {
      this.ionViewDidEnterDetection = '' + Date.now();
    }, 500);
  }

  goToPageTwo() {
    const nav = document.querySelector('ion-nav') as any;
    nav.push(PageTwo).then(() => console.log('push complete'));
  }
}

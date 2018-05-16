import { Component } from '@angular/core';

import { PageTwo } from './page-two';
import { Nav } from '@ionic/angular';

@Component({
  selector: 'page-one',
  template: `
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
  `
})
export class PageOne {

  ngOnInitDetection = 'initial';
  ionViewWillEnterDetection = 'initial';
  ionViewDidEnterDetection = 'initial';

  constructor(private nav: Nav) {}


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

  async goToPageTwo() {
    await this.nav.push(PageTwo);
  }
}

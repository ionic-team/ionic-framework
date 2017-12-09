import { Component } from '@angular/core';

@Component({
  selector: 'app-page-one',
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>Page One</ion-title>
  </ion-toolbar>
</ion-header>
<ion-content padding>
  Page One - {{blah}}
</ion-content>
  `
})
export class PageOneComponent {

  blah = 'initial';
  constructor() {

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
  }

  ionViewDidEnter() {
    setInterval(() => {
      this.blah = '' + Math.random();
      console.log('interval');
    }, 250);
  }
}

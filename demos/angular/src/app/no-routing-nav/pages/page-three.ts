import { Component } from '@angular/core';

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
  <ion-content>
    Page Three
    <div>
    <ion-button (click)="goBack()">Go Back</ion-button>
  </div>
    <ul>
      <li>ngOnInit - {{ngOnInitDetection}}</li>
      <li>ionViewWillEnter - {{ionViewWillEnterDetection}}</li>
      <li>ionViewDidEnter - {{ionViewDidEnterDetection}}</li>
    </ul>
  </ion-content>
  `
})
export class PageThree {

  ngOnInitDetection = 'initial';
  ionViewWillEnterDetection = 'initial';
  ionViewDidEnterDetection = 'initial';

  constructor() {

  }


  ngOnInit() {
    console.log('page two ngOnInit');
    setInterval(() => {
      this.ngOnInitDetection = '' + Date.now();
    }, 500);
  }

  ionViewWillEnter() {
    console.log('page two ionViewWillEnter');
    setInterval(() => {
      this.ionViewWillEnterDetection = '' + Date.now();
    }, 500);
  }

  ionViewDidEnter() {
    console.log('page two ionViewDidEnter');
    setInterval(() => {
      this.ionViewDidEnterDetection = '' + Date.now();
    }, 500);
  }

  goBack() {
    const nav = document.querySelector('ion-nav') as any;
    nav.pop().then(() => console.log('pop complete'));
  }
}

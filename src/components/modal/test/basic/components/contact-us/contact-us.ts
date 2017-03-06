import { Component } from '@angular/core';

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class ContactUsModal {
  root = 'ModalFirstPage';

  constructor() {
    console.log('ContactUs constructor');
  }
  ionViewDidLoad() {
    console.log('ContactUs ionViewDidLoad');
  }
  ionViewWillEnter() {
    console.log('ContactUs ionViewWillEnter');
  }
  ionViewDidEnter() {
    console.log('ContactUs ionViewDidEnter');
  }
  ionViewWillLeave() {
    console.log('ContactUs ionViewWillLeave');
  }
  ionViewDidLeave() {
    console.log('ContactUs ionViewDidLeave');
  }
  ionViewWillUnload() {
    console.log('ContactUs ionViewWillUnload');
  }
}

import { Component } from '@angular/core';
import { IonicPage } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'contact-us.html'
})
export class ContactUs {
  root = 'PageTwo';

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

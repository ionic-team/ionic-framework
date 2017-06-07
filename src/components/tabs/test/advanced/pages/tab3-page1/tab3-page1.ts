import { Component } from '@angular/core';
import { IonicPage } from '../../../../../..';

@IonicPage({
  name: 'tab3-page1'
})
@Component({
  templateUrl: './tab3-page1.html'
})
export class Tab3Page1 {

  ionViewWillEnter() {
    console.log('Tab3Page1, ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('Tab3Page1, ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('Tab3Page1, ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('Tab3Page1, ionViewDidLeave');
  }

  ionViewWillUnload() {
    console.log('Tab3Page1, ionViewWillUnload');
  }
}

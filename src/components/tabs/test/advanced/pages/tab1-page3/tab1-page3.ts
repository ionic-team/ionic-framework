import { Component } from '@angular/core';
@Component({
  templateUrl: './tab1page3.html'
})
export class Tab1Page3 {

  constructor() { }

  ionViewWillEnter() {
    console.log('Tab1Page3, ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('Tab1Page3, ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('Tab1Page3, ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('Tab1Page3, ionViewDidLeave');
  }

  ionViewWillUnload() {
    console.log('Tab1Page3, ionViewWillUnload');
  }
}

import { Component } from '@angular/core';
@Component({
  templateUrl: './tab2page2.html'
})
export class Tab2Page2 {
  tab2Page3 = 'tab2-page3';

  ionViewWillEnter() {
    console.log('Tab2Page2, ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('Tab2Page2, ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('Tab2Page2, ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('Tab2Page2, ionViewDidLeave');
  }

  ionViewWillUnload() {
    console.log('Tab2Page2, ionViewWillUnload');
  }
}

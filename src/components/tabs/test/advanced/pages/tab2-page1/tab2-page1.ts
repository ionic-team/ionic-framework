import { Component } from '@angular/core';

@Component({
  templateUrl: './tab2page1.html'
})
export class Tab2Page1 {
  tab2Page2 = 'tab2-page2';

  ionViewWillEnter() {
    console.log('Tab2Page1, ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('Tab2Page1, ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('Tab2Page1, ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('Tab2Page1, ionViewDidLeave');
  }

  ionViewWillUnload() {
    console.log('Tab2Page1, ionViewWillUnload');
  }
}

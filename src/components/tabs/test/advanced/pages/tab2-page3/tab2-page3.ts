import { Component } from '@angular/core';
import { IonicPage, NavController} from '../../../../../..';

@IonicPage({
  name: 'tab2-page3'
})
@Component({
  templateUrl: './tab2-page3.html'
})
export class Tab2Page3 {

  constructor(public navCtrl: NavController) {}

  ionViewWillEnter() {
    console.log('Tab2Page3, ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('Tab2Page3, ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('Tab2Page3, ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('Tab2Page3, ionViewDidLeave');
  }

  ionViewWillUnload() {
    console.log('Tab2Page3, ionViewWillUnload');
  }
}

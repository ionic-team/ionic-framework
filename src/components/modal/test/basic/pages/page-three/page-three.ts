import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'page-three.html'
})
export class PageThree {
  constructor(public navCtrl: NavController, params: NavParams) {
    console.log('Second page params:', params);
  }

  ionViewDidLoad() {
    console.log('PageThree ionViewDidLoad');
  }

  ionViewWillEnter() {
    console.log('PageThree ionViewWillEnter');
  }

  ionViewDidEnter() {
    console.log('PageThree ionViewDidEnter');
  }
}

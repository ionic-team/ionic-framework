import { Component } from '@angular/core';
import { NavController } from '../../../../src';
import { PushPage }from './push-page';

@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
  constructor(public navCtrl: NavController) {}

  push() {
    this.navCtrl.push(PushPage);
  }
}

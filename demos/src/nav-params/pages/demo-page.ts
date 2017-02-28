import { Component } from '@angular/core';
import { NavController } from '../../../../src';
import { PushPage } from './push-page';

@Component({
  templateUrl: 'page.html'
})
export class ApiDemoPage {
  myParam: string = '';

  constructor(public navCtrl: NavController) {}

  pushParams() {
    this.navCtrl.push(PushPage, { 'myParam': this.myParam });
  }
}

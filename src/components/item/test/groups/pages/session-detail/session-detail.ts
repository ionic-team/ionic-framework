import { Component } from '@angular/core';
import { NavController, NavParams } from '../../../../../..';

@Component({
  templateUrl: 'session-detail.html'
})
export class SessionDetail {
  session: any;

  constructor(params: NavParams, public navCtrl: NavController) {
    this.session = params.data;
  }
}

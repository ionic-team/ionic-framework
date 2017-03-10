import { Component } from '@angular/core';
import { DeepLink, NavController, NavParams } from '../../../../../..';

@DeepLink()
@Component({
  templateUrl: 'session-detail.html'
})
export class SessionDetail {
  session: any;

  constructor(params: NavParams, public navCtrl: NavController) {
    this.session = params.data;
  }
}

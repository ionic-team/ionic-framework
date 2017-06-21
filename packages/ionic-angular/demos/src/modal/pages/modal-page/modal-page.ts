import { Component } from '@angular/core';
import { NavParams, ViewController } from '../../../../../src';

@Component({
  templateUrl: 'modal-page.html'
})
export class ModalPage {
  myParam: string;

  constructor(
    public viewCtrl: ViewController,
    params: NavParams
  ) {
    this.myParam = params.get('myParam');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

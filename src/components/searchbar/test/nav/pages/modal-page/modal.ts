import { Component } from '@angular/core';
import { ViewController } from '../../../../../..';

@Component({
  templateUrl: 'modal.html'
})
export class ModalPage {
 constructor(public viewCtrl: ViewController) {}
  close() {
    this.viewCtrl.dismiss();
  }
}

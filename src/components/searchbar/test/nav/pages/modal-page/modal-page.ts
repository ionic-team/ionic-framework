import { Component } from '@angular/core';
import { DeepLink, ViewController } from '../../../../../..';

@DeepLink()
@Component({
  templateUrl: 'modal-page.html'
})
export class ModalPage {
 constructor(public viewCtrl: ViewController) {}
  close() {
    this.viewCtrl.dismiss();
  }
}

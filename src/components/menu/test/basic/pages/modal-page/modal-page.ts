import { Component } from '@angular/core';
import { IonicPage, ViewController } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'modal-page.html'
})
export class ModalPage {
  constructor(public viewController: ViewController) {
  }

  close() {
    this.viewController.dismiss();
  }
}

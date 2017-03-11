import { Component } from '@angular/core';
import { DeepLink, ViewController } from '../../../../../..';

@DeepLink()
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

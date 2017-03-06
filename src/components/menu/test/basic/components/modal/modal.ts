import { Component } from '@angular/core';
import { ViewController } from '../../../../../..';

@Component({ templateUrl: 'modal.html' })
export class Modal {
  constructor(public viewController: ViewController) { }
  close() {
    this.viewController.dismiss();
  }
}

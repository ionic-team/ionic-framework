import { Component } from '@angular/core';
import { DeepLink, ViewController } from '../../../../../..';

@DeepLink()
@Component({
  templateUrl: 'modal-with-inputs.html'
})
export class ModalWithInputs {
  data: any;

  constructor(public viewCtrl: ViewController) {
    this.data = {
      title: 'Title',
      note: 'Note',
      icon: 'home'
    };
  }

  public save(ev: any) {
    this.viewCtrl.dismiss(this.data);
  }

  public dismiss() {
    this.viewCtrl.dismiss(null);
  }
}

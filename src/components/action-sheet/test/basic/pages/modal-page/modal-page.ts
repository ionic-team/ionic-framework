import { Component } from '@angular/core';
import { IonicPage, ViewController } from '../../../../../..';

@IonicPage({
  name: 'modal-page'
})
@Component({
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons start>
          <button ion-button (click)="dismiss()" strong>Close</button>
        </ion-buttons>
        <ion-title>Modal</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Hi, I'm Bob, and I'm a modal.
    </ion-content>
  `
})
export class ModalPage {

  constructor(public viewCtrl: ViewController) {}

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

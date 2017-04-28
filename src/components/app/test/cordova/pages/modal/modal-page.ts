import { Component } from '@angular/core';
import { IonicPage, ViewController } from '../../../../../..';

@IonicPage({
  name: 'modal-page'
})
@Component({
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-title>This is a modal</ion-title>
      <ion-buttons left>
        <ion-button icon-only (click)="dismissModal()" class="e2eCordovaCloseModal">
          <ion-icon name="close"></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-buttons end>
        <ion-button icon-only>
          <ion-icon name="funnel"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content padding>
    <p>The modal toolbar should have status bar padding.</p>
    <ion-button block (click)="dismissModal()">Close modal</ion-button>
  </ion-content>
  `
})
export class ModalPage {
  constructor(public viewCtrl: ViewController) {}

  dismissModal() {
    this.viewCtrl.dismiss();
  }
}

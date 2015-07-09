import {IonicApp, IonicView, Modal} from 'ionic/ionic';

import {SinkPage} from '../sink-page';


@IonicView({
  template: `
  <ion-navbar *navbar><ion-nav-items primary><button icon (^click)="toggleMenu()"><i class="icon ion-navicon"></i></button></ion-nav-items><ion-title>Modal</ion-title></ion-navbar>

  <ion-content class="padding">
    <h2>Modal</h2>
    <p>
      Modals are entire views that slide in off screen.
    </p>
    <p>
      Modals make it easy to open a new "context" for the user, without taking them
      out of the current context. For example, clicking the "compose" button
      on a mail app might slide up a Compose modal.
    </p>
    <button primary (click)="openModal()">Open Modal</button>
  </ion-content>
  `
})
export class ModalPage extends SinkPage {
  constructor(app: IonicApp, modal: Modal) {
    super(app);
    this.modal = modal;
  }

  openModal() {
    console.log('Opening modal');

    this.modal.open(MyModal);
  }
}


@IonicView({
  template: '<ion-content padding><button (click)="close()" primary>Close Modal</button></ion-content>',
})
export class MyModal {}

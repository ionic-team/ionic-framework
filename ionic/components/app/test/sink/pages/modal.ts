import {Component, Directive, View} from 'angular2/angular2';

import {IonicView, ActionMenu, Modal, NavbarTemplate, Navbar, NavController, Content} from 'ionic/ionic';


@Component({
  selector: 'ion-view'
})
@IonicView({
  template: `
  <ion-navbar *navbar><ion-title>Modal</ion-title></ion-navbar>

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
export class ModalPage {
  constructor(modal: Modal) {
    this.modal = modal;
  }

  openModal() {
    console.log('Opening modal');

    this.modal.open(MyModal, {
      enterAnimation: 'my-fade-in',
      leaveAnimation: 'my-fade-out',
      handle: 'my-awesome-modal'
    });
  }
}


@IonicView({
  template: '<ion-content padding><button (click)="close()" primary>Close Modal</button></ion-content>',
})
export class MyModal {}

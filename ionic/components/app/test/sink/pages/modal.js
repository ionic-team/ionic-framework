import {NgFor, Injector, DomRenderer, ElementRef} from 'angular2/angular2';
import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {IonicView, ActionMenu, Modal, NavbarTemplate, Navbar, NavController, Content} from 'ionic/ionic';

@Component({
  selector: 'ion-view',
  appInjector: [Modal]
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
  `,
  directives: [NavbarTemplate, Navbar, Content]
})
export class ModalPage {
  constructor(Modal: Modal) {
    this.Modal = Modal;
  }

  openModal() {
    console.log('Opening modal');

    this.Modal.open(MyModal, {
      enterAnimation: 'my-fade-in',
      leaveAnimation: 'my-fade-out',
      handle: 'my-awesome-modal'
    });
  }
}

@IonicComponent(Modal)
@IonicView({
  template: '<ion-content padding><button (click)="close()" primary>Close Modal</button></ion-content>',
})
export class MyModal extends Modal {
  constructor() {
    super();
  }
}

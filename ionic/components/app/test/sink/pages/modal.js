import {NgFor, DynamicComponentLoader, Injector, DomRenderer, ElementRef} from 'angular2/angular2';
import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {ActionMenu, Modal, ModalRef,
  NavbarTemplate, Navbar, NavController, Button, Content} from 'ionic/ionic';

@Component({
  selector: 'ion-view'
})
@View({
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
  directives: [NavbarTemplate, Navbar, Content, Button]
})
export class ModalPage {
  constructor(nav: NavController, loader: DynamicComponentLoader, injector: Injector, domRenderer: DomRenderer, elementRef: ElementRef) {
    this.loader = loader;
    this.domRenderer = domRenderer;
    this.elementRef = elementRef;
    this.injector = injector;

    this.nav = nav;
    window.nav = nav;

    console.log('IonicApp Start', loader, domRenderer, elementRef);
  }

  openModal() {
    console.log('Opening modal');

    Modal.show(MyModal, this.loader, this.injector, this.domRenderer, this.elementRef);
  }

  openMenu() {
    console.log('Opening Modal')

  }

}

@Component({
  selector: 'my-modal'
})
@View({
  template: '<ion-content padding><button (click)="close()" primary>Close Modal</button></ion-content>',
  directives: [Button, Content]
})
export class MyModal {
  constructor(modalRef: ModalRef) {
    //this.initial = ModalFirstPage;
    this.modalRef = modalRef;
  }
  close() {
    console.log('Closing modal');
    this.modalRef.close();
  }
}

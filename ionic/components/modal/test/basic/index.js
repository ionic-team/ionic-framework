import {DynamicComponentLoader, ElementRef, ComponentRef, onDestroy, DomRenderer} from 'angular2/angular2';
import {bind, Injector} from 'angular2/di';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Parent, Ancestor} from 'angular2/src/core/annotations_impl/visibility';

import {Content, List, Item, Modal, ModalRef} from 'ionic/ionic';

import {Nav, IonicComponent} from 'ionic/ionic';
import {NavController, NavParams, NavbarTemplate, Navbar} from 'ionic/ionic';


@Component({ selector: 'ion-view' })
@View({
  templateUrl: 'main.html',
  directives: [Content, List, Item]
})
class IonicApp {
  openModal() {
    console.log('Opening modal');
    Modal.open(ContactModal);
  }
}

@IonicComponent(Modal)
@View({
  template: '<ion-nav [initial]="initial"></ion-nav>',
  directives: [Nav, Content]
})
export class ContactModal extends Modal {
  constructor() {
    super();
    this.initial = ModalFirstPage;
  }
}

@Component({selector: 'ion-view'})
@View({
  template: `
    <ion-navbar *navbar><ion-title>First Page Header: {{ val }}</ion-title><ion-nav-items primary><button primary (click)="closeModal()">Close</button></ion-nav-items></ion-navbar>

    <ion-content class="padding">

      <p>First Page: {{ val }}</p>

      <p>
        <button primary (click)="push()">Push (Go to 2nd)</button>
      </p>

      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>

    </ion-content>
  `,
  directives: [NavbarTemplate, Navbar, Content]
})
export class ModalFirstPage {
  constructor(
    //@Parent() modal: ContactModal,
    nav: NavController
  ) {
    //this.modal = modal;
    this.nav = nav;
    this.val = Math.round(Math.random() * 8999) + 1000;
  }

  push() {
    this.nav.push(ModalSecondPage, { id: 8675309, myData: [1,2,3,4] }, { animation: 'ios' });
  }

  closeModal() {
    // TODO(maxlynch): Figure out a much better way to get the parent ContactModal
    var m = this.nav._nav.elementRef.parentView._view.context;

    //this.modal.close();
    m.close();
  }
}

@Component({selector: 'ion-view'})
@View({
  template: `
    <ion-navbar *navbar><ion-title>Second Page Header</ion-title></ion-navbar>

    <ion-content class="padding">

      <p>
        <button primary (click)="pop()">Pop (Go back to 1st)</button>
      </p>

      <p>
        <button primary (click)="push()">Push (Go to 3rd)</button>
      </p>

      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>
      <f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f><f></f>

    </ion-content>
  `,
  directives: [NavbarTemplate, Navbar, Content]
})
export class ModalSecondPage {
  constructor(
    nav: NavController,
    params: NavParams
  ) {
    this.nav = nav;
    this.params = params;

    console.log('Second page params:', params);
  }

  pop() {
    this.nav.pop();
  }

  push() {
  }

}

export function main(ionicBootstrap) {
  ionicBootstrap(IonicApp);
}

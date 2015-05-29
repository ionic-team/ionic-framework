import {DynamicComponentLoader, ElementRef, ComponentRef, onDestroy, DomRenderer} from 'angular2/angular2';
import {bind, Injector} from 'angular2/di';
import {bootstrap} from 'angular2/angular2'
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Parent, Ancestor} from 'angular2/src/core/annotations_impl/visibility';

import {Content, List, Item, Button, Modal, ModalRef} from 'ionic/ionic';

import {Nav} from 'ionic/ionic';
import {NavController, NavParams, NavbarTemplate, Navbar} from 'ionic/ionic';


@Component({ selector: 'ion-app' })
@View({
  templateUrl: 'main.html',
  directives: [Content, List, Item, Button]
})
class IonicApp {
  constructor(loader: DynamicComponentLoader, injector: Injector, domRenderer: DomRenderer, elementRef: ElementRef) {
    this.loader = loader;
    this.domRenderer = domRenderer;
    this.elementRef = elementRef;
    this.injector = injector;

    console.log('IonicApp Start', loader, domRenderer, elementRef);
  }

  openModal() {
    console.log('Opening modal');

    Modal.show(ContactModal, this.loader, this.injector, this.domRenderer, this.elementRef);

  }
}

@Component({
  selector: 'contact-modal'
})
@View({
  //template: '<ion-content padding><button primary (click)="close()">Close</button></ion-content>',//
  template: '<ion-nav [initial]="initial"></ion-nav>',
  /*
  template: `
      <p>First Page: {{ val }}</p>
      <p>
      <button primary (click)="close()">Close</button>
      </p>`,
      */
  directives: [Nav, Button, Content]
})
export class ContactModal {
  constructor(modalRef: ModalRef) {
    this.initial = ModalFirstPage;
    this.modalRef = modalRef;
  }
  close() {
    console.log('Closing modal');
    this.modalRef.close();
  }
}

@Component({selector: 'ion-view'})
@View({
  template: `
    <ion-navbar *navbar><ion-title>First Page Header: {{ val }}</ion-title><ion-nav-items primary><button primary class="button" (click)="closeModal()">Close</button></ion-nav-items></ion-navbar>

    <ion-content class="padding">

      <p>First Page: {{ val }}</p>

      <p>
        <button class="button" (click)="push()">Push (Go to 2nd)</button>
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
    this.modal.close();
  }
}

@Component({selector: 'ion-view'})
@View({
  template: `
    <ion-navbar *navbar><ion-title>Second Page Header</ion-title></ion-navbar>

    <ion-content class="padding">

      <p>
        <button class="button" (click)="pop()">Pop (Go back to 1st)</button>
      </p>

      <p>
        <button class="button" (click)="push()">Push (Go to 3rd)</button>
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


export function main() {
  bootstrap(IonicApp).then((appRef) => {
    console.log('Done bootstrapping', appRef);

  })
}

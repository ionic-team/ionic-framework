import {DynamicComponentLoader, ElementRef, ComponentRef, onDestroy, DomRenderer} from 'angular2/angular2';

import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Nav} from 'ionic/ionic';

import {raf, ready} from 'ionic/util/dom'

import {NavController, NavbarTemplate, Navbar, Content} from 'ionic/ionic';

@Component({
  selector: 'ion-modal-wrapper'
})
@View({
  template: `
    <div class="modal-backdrop active">
      <div class="modal-backdrop-bg"></div>
      <div class="modal-wrapper"><content></content></div>
    </div>`
})
class ModalWrapper {
  constructor(elementRef: ElementRef) {
    this.element = elementRef.domElement;
    console.log('element', this.element)
  }
  show() {
    this.element.domElement.classList.add('active')
  }
  hide() {
    this.element.domElement.classList.remove('active')
  }
}

@Component({
  selector: 'ion-modal'
})
@View({
  template: `
    <!--<ion-modal-wrapper>-->
    <div class="modal">
      <ion-nav [initial]="initial"></ion-nav>
    </div>
    <!--</ion-modal-wrapper>-->`,
  directives: [Nav],
})
export class Modal {
  //compiler: Compiler;

  constructor(loader: DynamicComponentLoader, domRenderer: DomRenderer, elementRef: ElementRef) {
    this.componentLoader = loader;
    this.domRenderer = domRenderer;

    this.element = elementRef.domElement;
    this.elementRef = elementRef;

    this.initial = ModalFirstPage
  }


  static create() {
    var m = new Modal();
    return m;
  }

  show() {
    console.log('Modal show');

    return this.componentLoader.loadIntoNewLocation(Modal, this.elementRef).then((containerRef) => {
      var modalEl = this.domRenderer.getHostElement(containerRef.hostView.render);

      document.body.appendChild(modalEl);

      raf(() => {
        modalEl.classList.add('active');
      });

      console.log('Loaded into new location', containerRef, modalEl);
    });
  }

  static show(loader: ComponentLoader, renderer: DomRenderer, elementRef: ElementRef) {
    console.log('Showing modal');

    var newModal = new Modal(loader, renderer, elementRef);
    newModal.show();
    return newModal;
  }
}

@Component({selector: 'ion-view'})
@View({
  template: `
    <ion-navbar *navbar><ion-title>First Page Header: {{ val }}</ion-title></ion-navbar>

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
    nav: NavController
  ) {
    this.nav = nav;
    this.val = Math.round(Math.random() * 8999) + 1000;
  }

  push() {
  }
}

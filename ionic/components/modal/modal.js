import {DynamicComponentLoader, ElementRef, ComponentRef, onDestroy, DomRenderer} from 'angular2/angular2';
import {bind, Injector} from 'angular2/di';
import {Promise} from 'angular2/src/facade/async';
import {isPresent, Type} from 'angular2/src/facade/lang';

import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Parent} from 'angular2/src/core/annotations_impl/visibility';

import {raf, ready} from 'ionic/util/dom'
import * as util from 'ionic/util'

import {Animation} from '../../animations/animation';

export class Modal {
  //compiler: Compiler;

  constructor(type: Type, loader: DynamicComponentLoader, injector: Injector, domRenderer: DomRenderer, elementRef: ElementRef, opts) {
    this.modalType = type;
    this.componentLoader = loader;
    this.domRenderer = domRenderer;
    this.injector = injector;

    this.element = elementRef.domElement;
    this.elementRef = elementRef;

    this.opts = util.extend({
      openAnimation: 'slide-in',
      closeAnimation: 'slide-out'
    }, opts || {});
  }


  static create(modalType: Type, loader: ComponentLoader, injector: Injector, renderer: DomRenderer, elementRef: ElementRef, opts) {
    console.log('Create', modalType, loader, injector, renderer, elementRef);

    var m = new Modal(modalType, loader, injector, renderer, elementRef, opts);

    var modalPromise = new Promise(resolve => {

      // Inject it into the page
      m._inject().then(() => {
        resolve(m);
      })
    })

    return modalPromise;
  }

  _inject() {
    console.log('Modal show');


    // Create the dialogRef here so that it can be injected into the content component.
    var modalRef = new ModalRef();
    var modalRefBinding = bind(ModalRef).toValue(modalRef);
    var contentInjector = this.injector.resolveAndCreateChild([modalRefBinding]);

    this._modalRef = modalRef;
    // Load the modal wrapper object and insert into the page
    return this.componentLoader.loadIntoNewLocation(ModalContainer, this.elementRef).then((containerRef) => {
      var modalEl = this.domRenderer.getHostElement(containerRef.hostView.render);

      document.body.querySelector('ion-app').appendChild(modalEl);

      this.modalElement = modalEl;

      console.log('Loaded into new location', modalEl);

      modalRef.containerRef = containerRef;

      modalRef.setOptions(this.opts);

      // Now load the user's modal component into the Modal
      return this.componentLoader.loadNextToExistingLocation(
          this.modalType, containerRef.instance.contentRef, contentInjector).then(contentRef => {

        modalRef.contentRef = contentRef;
        modalRef.instance.modalRef = modalRef;
        return modalRef;
      });
    });
    //});
  }

  show() {
    return this._modalRef.open();
  }

  close() {
    return this._modalRef.close();
  }


  static show(modalType: Type, loader: ComponentLoader, injector: Injector, renderer: DomRenderer, elementRef: ElementRef, opts) {
    console.log('Showing modal', opts);

    Modal.create(modalType, loader, injector, renderer, elementRef, opts).then((newModal) => {
      newModal.show();
    });
  }
}

@Component({
  selector: 'ion-modal'
})
@View({
  template: '<ion-modal-content></ion-modal-content>',
  directives: [ModalContent]
})
class ModalContainer {
  constructor(elementRef: ElementRef) {
    this.domElement = elementRef.domElement;
  }

  open(animation) {
    console.log('Opening w/ anim', animation);
    var slideIn = Animation.create(this.domElement, animation);
    return slideIn.play();
  }

  close(animation) {
    console.log('Closing w/ anim', animation);
    var slideOut = Animation.create(this.domElement, animation);
    return slideOut.play();
  }
}

@Directive({selector: 'ion-modal-content'})
class ModalContent {
  constructor(@Parent() modalContainer: ModalContainer, elementRef: ElementRef) {
    modalContainer.contentRef = elementRef;
  }
}



export class ModalRef {
  constructor() {
    this._contentRef = null;
    this.containerRef = null;
    this.isClosed = false;
  }

  setOptions(opts) {
    this.opts = opts;
  }

  open() {
    this.containerRef.instance.open(this.opts.openAnimation).then(() => {
      this.isClosed = false;
    })
  }

  close() {
    // Close, then dispose y'all
    this.containerRef.instance.close(this.opts.closeAnimation).then(() => {
      this.isClosed = true;
      this.containerRef.dispose();
    })
  }


  set contentRef(value: ComponentRef) {
    this._contentRef = value;
  }

  /** Gets the component instance for the content of the dialog. */
  get instance() {
    if (isPresent(this._contentRef)) {
      return this._contentRef.instance;
    }

    // The only time one could attempt to access this property before the value is set is if an access occurs during
    // the constructor of the very instance they are trying to get (which is much more easily accessed as `this`).
    throw "Cannot access dialog component instance *from* that component's constructor.";
  }
}

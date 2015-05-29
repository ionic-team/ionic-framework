import {DynamicComponentLoader, ElementRef, ComponentRef, onDestroy, DomRenderer} from 'angular2/angular2';
import {bind, Injector} from 'angular2/di';
import {Promise} from 'angular2/src/facade/async';
import {isPresent, Type} from 'angular2/src/facade/lang';

import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {Parent} from 'angular2/src/core/annotations_impl/visibility';

import {raf, ready} from 'ionic/util/dom'

import {Animation} from '../../animations/animation';

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

/*
@Component({
  selector: 'ion-modal'
})
@View({
  template: `
    <!--<ion-modal-wrapper>-->
    <div class="modal">
    </div>
    <!--</ion-modal-wrapper>-->`,
  directives: []
})
*/
export class Modal {
  //compiler: Compiler;

  constructor(type: Type, loader: DynamicComponentLoader, injector: Injector, domRenderer: DomRenderer, elementRef: ElementRef) {
    this.modalType = type;
    this.componentLoader = loader;
    this.domRenderer = domRenderer;
    this.injector = injector;

    this.element = elementRef.domElement;
    this.elementRef = elementRef;
  }


  static create(modalType: Type, loader: ComponentLoader, injector: Injector, renderer: DomRenderer, elementRef: ElementRef) {
    console.log('Create', modalType, loader, injector, renderer, elementRef);

    var m = new Modal(modalType, loader, injector, renderer, elementRef);

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

    // Load the modal wrapper object and insert into the page
    return this.componentLoader.loadIntoNewLocation(ModalContainer, this.elementRef).then((containerRef) => {
      var modalEl = this.domRenderer.getHostElement(containerRef.hostView.render);

      document.body.appendChild(modalEl);

      this.modalElement = modalEl;

      console.log('Loaded into new location', modalEl);

      modalRef.containerRef = containerRef;

      // Now load the user's modal component into the Modal
      return this.componentLoader.loadNextToExistingLocation(
          this.modalType, containerRef.instance.contentRef, contentInjector).then(contentRef => {

        modalRef.contentRef = contentRef;
        modalRef.instance.modalRef = modalRef;
        return modalRef;


        // Wrap both component refs for the container and the content so that we can return
        // the `instance` of the content but the dispose method of the container back to the
        // opener.
        //dialogRef.contentRef = contentRef;
        //containerRef.instance.dialogRef = dialogRef;

        //backdropRefPromise.then(backdropRef => {
        //  dialogRef.whenClosed.then((_) => {
        //    backdropRef.dispose();
        //  });
        //});

        //return dialogRef;
      });
    });
    //});
  }

  show() {
    raf(() => {
      this.modalElement.classList.add('active');
    });
  }


  static show(modalType: Type, loader: ComponentLoader, injector: Injector, renderer: DomRenderer, elementRef: ElementRef) {
    console.log('Showing modal');

    Modal.create(modalType, loader, injector, renderer, elementRef).then((newModal) => {
      newModal.show();
    });
  }
}

/**
 * Container for user-provided dialog content.
 */
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

    this.animation = new Animation(this.domElement);
    console.log('Animation', this.domElement);
    var slideIn = new Animation(this.domElement);

    slideIn
      .easing('cubic-bezier(0.1, 0.7, 0.1, 1)')
      .duration(400)
      .from('translateY', '100%')
      .to('translateY', '0%')
      .play();
  }
}

/**
 * Simple decorator used only to communicate an ElementRef to the parent MdDialogContainer as the location
 * for where the dialog content will be loaded.
 */
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

  close() {
    this.isClosed = true;
    this.containerRef.dispose();
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

import {Component, ComponentRef, ElementRef, ViewChild, ViewContainerRef, ComponentResolver} from '@angular/core';

import {addSelector} from '../../config/bootstrap';
import {Animation} from '../../animations/animation';
import {NavParams} from '../nav/nav-params';
import {pascalCaseToDashCase} from '../../util/util';
import {Transition, TransitionOptions} from '../../transitions/transition';
import {ViewController} from '../nav/view-controller';
import {windowDimensions} from '../../util/dom';

import {nativeRaf, CSS} from '../../util/dom';

/**
 * @name Modal
 * @description
 * A Modal is a content pane that goes over the user's current page.
 * Usually it is used for making a choice or editing an item. A modal uses the
 * `NavController` to
 * {@link /docs/v2/api/components/nav/NavController/#present present}
 * itself in the root nav stack. It is added to the stack similar to how
 * {@link /docs/v2/api/components/nav/NavController/#push NavController.push}
 * works.
 *
 * When a modal (or any other overlay such as an alert or actionsheet) is
 * "presented" to a nav controller, the overlay is added to the app's root nav.
 * After the modal has been presented, from within the component instance The
 * modal can later be closed or "dismissed" by using the ViewController's
 * `dismiss` method. Additionally, you can dismiss any overlay by using `pop`
 * on the root nav controller.
 *
 * Data can be passed to a new modal through `Modal.create()` as the second
 * argument. The data can then be accessed from the opened page by injecting
 * `NavParams`. Note that the page, which opened as a modal, has no special
 * "modal" logic within it, but uses `NavParams` no differently than a
 * standard page.
 *
 * @usage
 * ```ts
 * import {Page, Modal, NavController, NavParams} from 'ionic-angular';
 *
 * @Component(...)
 * class HomePage {
 *
 *  constructor(nav: NavController) {
 *    this.nav = nav;
 *  }
 *
 *  presentProfileModal() {
 *    let profileModal = Modal.create(Profile, { userId: 8675309 });
 *    this.nav.present(profileModal);
 *  }
 *
 * }
 *
 * @Component(...)
 * class Profile {
 *
 *  constructor(params: NavParams) {
 *    console.log('UserId', params.get('userId'));
 *  }
 *
 * }
 * ```
 *
 * A modal can also emit data, which is useful when it is used to add or edit
 * data. For example, a profile page could slide up in a modal, and on submit,
 * the submit button could pass the updated profile data, then dismiss the
 * modal.
 *
 * ```ts
 * import {Component} from '@angular/core';
 * import {Modal, NavController, ViewController} from 'ionic-angular';
 *
 * @Component(...)
 * class HomePage {
 *
 *  constructor(nav: NavController) {
 *    this.nav = nav;
 *  }
 *
 *  presentContactModal() {
 *    let contactModal = Modal.create(ContactUs);
 *    this.nav.present(contactModal);
 *  }
 *
 *  presentProfileModal() {
 *    let profileModal = Modal.create(Profile, { userId: 8675309 });
 *    profileModal.onDismiss(data => {
 *      console.log(data);
 *    });
 *    this.nav.present(profileModal);
 *  }
 *
 * }
 *
 * @Component(...)
 * class Profile {
 *
 *  constructor(viewCtrl: ViewController) {
 *    this.viewCtrl = viewCtrl;
 *  }
 *
 *  dismiss() {
 *    let data = { 'foo': 'bar' };
 *    this.viewCtrl.dismiss(data);
 *  }
 *
 * }
 * ```
 * @demo /docs/v2/demos/modal/
 * @see {@link /docs/v2/components#modals Modal Component Docs}
 */
export class Modal extends ViewController {

  public modalViewType: string;

  constructor(componentType: any, data: any = {}) {
    data.componentType = componentType;
    super(ModalCmp, data);
    this.modalViewType = componentType.name;
    this.viewType = 'modal';
    this.isOverlay = true;
    this.usePortal = true;
  }

  /**
  * @private
  */
  getTransitionName(direction: string) {
    let key = (direction === 'back' ? 'modalLeave' : 'modalEnter');
    return this._nav && this._nav.config.get(key);
  }

  /**
   * @param {any} componentType Modal
   * @param {object} data Modal options
   */
  static create(componentType: any, data = {}) {
    return new Modal(componentType, data);
  }

  // Override the load method and load our child component
  loaded(done: Function) {
    // grab the instance, and proxy the ngAfterViewInit method
    let originalNgAfterViewInit = this.instance.ngAfterViewInit;

    this.instance.ngAfterViewInit = () => {
      if (originalNgAfterViewInit) {
        originalNgAfterViewInit();
      }
      this.instance.loadComponent(done);
    };
  }
}

@Component({
  selector: 'ion-modal',
  template:
    '<ion-backdrop disableScroll="false"></ion-backdrop>' +
    '<div class="modal-wrapper">' +
      '<div #viewport></div>' +
    '</div>'
})
export class ModalCmp {

  @ViewChild('viewport', {read: ViewContainerRef}) viewport: ViewContainerRef;

  constructor(
    private _compiler: ComponentResolver,
    private _navParams: NavParams,
    private _viewCtrl: ViewController
  ) {}

  loadComponent(done: Function) {
    addSelector(this._navParams.data.componentType, 'ion-modal-inner');

    this._compiler.resolveComponent(this._navParams.data.componentType).then((componentFactory) => {
      let componentRef = this.viewport.createComponent(componentFactory, this.viewport.length, this.viewport.parentInjector);

      this._viewCtrl.setInstance(componentRef.instance);

      done();
    });
  }

  ngAfterViewInit() {
    // intentionally kept empty
  }
}

/**
 * Animations for modals
 */
 class ModalSlideIn extends Transition {
   constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
     super(opts);

     let ele = enteringView.pageRef().nativeElement;
     let backdropEle = ele.querySelector('ion-backdrop');
     let backdrop = new Animation(backdropEle);
     let wrapper = new Animation(ele.querySelector('.modal-wrapper'));
     let page = <HTMLElement> ele.querySelector('ion-page');
     let pageAnimation = new Animation(page);

     // auto-add page css className created from component JS class name
     let cssClassName = pascalCaseToDashCase((<Modal>enteringView).modalViewType);
     pageAnimation.before.addClass(cssClassName);
     pageAnimation.before.addClass('show-page');

     backdrop.fromTo('opacity', 0.01, 0.4);
     wrapper.fromTo('translateY', '100%', '0%');


     this
       .element(enteringView.pageRef())
       .easing('cubic-bezier(0.36,0.66,0.04,1)')
       .duration(400)
       .add(backdrop)
       .add(wrapper)
       .add(pageAnimation);

     if (enteringView.hasNavbar()) {
       // entering page has a navbar
       let enteringNavBar = new Animation(enteringView.navbarRef());
       enteringNavBar.before.addClass('show-navbar');
       this.add(enteringNavBar);
     }
   }
 }
 Transition.register('modal-slide-in', ModalSlideIn);


class ModalSlideOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('ion-backdrop'));
    let wrapperEle = <HTMLElement> ele.querySelector('.modal-wrapper');
    let wrapperEleRect = wrapperEle.getBoundingClientRect();
    let wrapper = new Animation(wrapperEle);

    // height of the screen - top of the container tells us how much to scoot it down
    // so it's off-screen
    let screenDimensions = windowDimensions();
    wrapper.fromTo('translateY', '0px', `${screenDimensions.height - wrapperEleRect.top}px`);
    backdrop.fromTo('opacity', 0.4, 0.0);

    this
      .element(leavingView.pageRef())
      .easing('ease-out')
      .duration(250)
      .add(backdrop)
      .add(wrapper);
  }
}
Transition.register('modal-slide-out', ModalSlideOut);


class ModalMDSlideIn extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('ion-backdrop'));
    let wrapper = new Animation(ele.querySelector('.modal-wrapper'));
    let page = <HTMLElement> ele.querySelector('ion-page');
    let pageAnimation = new Animation(page);

    // auto-add page css className created from component JS class name
    let cssClassName = pascalCaseToDashCase((<Modal>enteringView).modalViewType);
    pageAnimation.before.addClass(cssClassName);
    pageAnimation.before.addClass('show-page');


    backdrop.fromTo('opacity', 0.01, 0.4);
    wrapper.fromTo('translateY', '40px', '0px');
    wrapper.fromTo('opacity', '0.01', '1.0');

    const DURATION = 280;
    const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
    this.element(enteringView.pageRef()).easing(EASING).duration(DURATION)
      .add(backdrop)
      .add(wrapper)
      .add(pageAnimation);

    if (enteringView.hasNavbar()) {
      // entering page has a navbar
      let enteringNavBar = new Animation(enteringView.navbarRef());
      enteringNavBar.before.addClass('show-navbar');
      this.add(enteringNavBar);
    }
  }
}
Transition.register('modal-md-slide-in', ModalMDSlideIn);


class ModalMDSlideOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('ion-backdrop'));
    let wrapper = new Animation(ele.querySelector('.modal-wrapper'));

    backdrop.fromTo('opacity', 0.4, 0.0);
    wrapper.fromTo('translateY', '0px', '40px');
    wrapper.fromTo('opacity', '1.0', '0.00');

    this
      .element(leavingView.pageRef())
      .duration(200)
      .easing('cubic-bezier(0.47,0,0.745,0.715)')
      .add(wrapper)
      .add(backdrop);
  }
}
Transition.register('modal-md-slide-out', ModalMDSlideOut);

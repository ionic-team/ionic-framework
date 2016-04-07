import {ViewController} from '../nav/view-controller';
import {Animation} from '../../animations/animation';
import {Transition, TransitionOptions} from '../../transitions/transition';

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
 * argument. The data can gen be accessed from the opened page by injecting
 * `NavParams`. Note that the page, which opened as a modal, has no special
 * "modal" logic within it, but uses `NavParams` no differently than a
 * standard page.
 *
 * @usage
 * ```ts
 * import {Page, Modal, NavController, NavParams} from 'ionic-angular';
 *
 * @Page(...)
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
 * @Page(...)
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
 * import {Page, Modal, NavController, ViewController} from 'ionic-angular';
 *
 * @Page(...)
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
 * @Page(...)
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

  constructor(componentType, data = {}) {
    super(componentType, data);
    this.viewType = 'modal';
    this.isOverlay = true;
  }

  /**
  * @private
  */
  getTransitionName(direction) {
    let key = (direction === 'back' ? 'modalLeave' : 'modalEnter');
    return this._nav && this._nav.config.get(key);
  }

  /**
   * @param {any} componentType Modal
   * @param {object} data Modal options
   */
  static create(componentType, data = {}) {
    return new Modal(componentType, data);
  }

}


/**
 * Animations for modals
 */
class ModalSlideIn extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);
    this
      .element(enteringView.pageRef())
      .easing('cubic-bezier(0.36,0.66,0.04,1)')
      .duration(400)
      .fromTo('translateY', '100%', '0%')
      .before.addClass('show-page');

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
    this
      .element(leavingView.pageRef())
      .easing('ease-out')
      .duration(250)
      .fromTo('translateY', '0%', '100%');
  }
}
Transition.register('modal-slide-out', ModalSlideOut);


class ModalMDSlideIn extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);
    this
      .element(enteringView.pageRef())
      .easing('cubic-bezier(0.36,0.66,0.04,1)')
      .duration(280)
      .fromTo('translateY', '40px', '0px')
      .fadeIn()
      .before.addClass('show-page');

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
    this
      .element(leavingView.pageRef())
      .duration(200)
      .easing('cubic-bezier(0.47,0,0.745,0.715)')
      .fromTo('translateY', '0px', '40px')
      .fadeOut();
  }
}
Transition.register('modal-md-slide-out', ModalMDSlideOut);

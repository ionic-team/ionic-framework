import {NavController, NavParams} from '../nav/nav-controller';
import {ViewController} from '../nav/view-controller';
import {Config} from '../../config/config';
import {Animation} from '../../animations/animation';

/**
 * @name Modal
 * @description
 * The Modal is a content pane that can go over the user's current page.
 * Usually it is used for making a choice or editing an item. A modal uses the
 * `NavController` to "present" itself in the root nav stack. It is added to the
 * stack similar to how
 * {@link /docs/v2/api/components/nav/NavController/#push NavController.push}
 * works, where it is passed a Page component, along with optional Page params
 *
 * When a modal (or any other overlay such as an alert or actionsheet) is
 * "presented" to a nav controller, the overlay is added to the app's root nav.
 * After the modal has been presented, from within the component instance The
 * modal can later be closed or "dimsissed" by using the ViewController's
 * `dismiss` method. Additinoally, you can dismiss any overlay by using `pop`
 * on the root nav controller.
 *
 * A modal can also emit data, which is useful when it is used to add or edit
 * data. For example, a profile page could slide up in a modal, and on submit,
 * the submit button could emit the updated profile data, then dismiss the modal.
 * From that point, anything which is subscribed to the modal's `data` event
 * would receive the modal's data.
 *
 * @usage
 * ```ts
 * import {Modal, NavController} from 'ionic/ionic';
 *
 * class MyApp {
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
 *    this.nav.present(profileModal, {
 *      animation: 'my-fade-in'
 *    });
 *    profileModal.data.subscribe(data => {
 *      console.log(data);
 *    });
 *  }
 *
 * }
 * ```
 * @demo /docs/v2/demos/modal/
 * @see {@link /docs/v2/components#modals Modal Component Docs}
 */
export class Modal extends ViewController {

  constructor(componentType, data={}) {
    super(componentType, data);
    this.viewType = 'modal';
  }

  getTransitionName(direction) {
    let key = (direction === 'back' ? 'modalLeave' : 'modalEnter');
    return this._nav && this._nav.config.get(key);
  }

  static create(componentType, data={}) {
    return new Modal(componentType, data);
  }

}


/**
 * Animations for modals
 */
class ModalSlideIn extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(enteringView.pageRef(), opts);
    this
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
Animation.register('modal-slide-in', ModalSlideIn);


class ModalSlideOut extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(leavingView.pageRef(), opts);
    this
      .easing('ease-out')
      .duration(250)
      .fromTo('translateY', '0%', '100%');
  }
}
Animation.register('modal-slide-out', ModalSlideOut);


class ModalMDSlideIn extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(enteringView.pageRef(), opts);
    this
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
Animation.register('modal-md-slide-in', ModalMDSlideIn);


class ModalMDSlideOut extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(leavingView.pageRef(), opts);
    this
      .duration(200)
      .easing('cubic-bezier(0.47,0,0.745,0.715)')
      .fromTo('translateY', '0px', '40px')
      .fadeOut();
  }
}
Animation.register('modal-md-slide-out', ModalMDSlideOut);

import {Injectable} from 'angular2/angular2';

import {OverlayController} from '../overlay/overlay-controller';
import {Config} from '../../config/config';
import {Animation} from '../../animations/animation';
import {extend} from 'ionic/util';

/**
 * The Modal is a content pane that can go over the user's current page.
 * Usually used for making a choice or editing an item. A modal can be opened
 * similar to how NavController#push works, where it is passed a Page component,
 * along with optional Page params, and options for presenting the modal.
 *
 * @usage
 * ```ts
 * class MyApp {
 *
 *  constructor(modal: Modal) {
 *    this.modal = modal;
 *  }
 *
 *  openContactModal() {
 *    this.modal.open(ContactUs);
 *  }
 *
 *  openProfileModal() {
 *    this.modal.open(Profile, { userId: 8675309 }, {
 *      enterAnimation: 'my-fade-in',
 *      leaveAnimation: 'my-fade-out',
 *      handle: 'profile-modal'
 *    });
 *  }
 *
 * }
 * ```
 */
@Injectable()
export class Modal {

  constructor(ctrl: OverlayController, config: Config) {
    this.ctrl = ctrl;
    this.config = config;
  }

  /**
   * Opens a new modal using the page component is was pass as the first
   * argument. This is similar to how NavController's `push` method works.
   * Currently you must have `<ion-overlay>` in the @App component's template
   * for the modal to work correctly. (This is something that will
   * be hopefully be removed in the near future.)
   * @param pageComponent  The Page component to load in the modal.
   * @param [params={}]  Optional data which can be passed to the page
   * component, which can be read from the constructor's `NavParams`.
   * @param [opts={}]  Additional options for this one modal instance of.
   * Options include `enterAnimation` and `leaveAnimation`, which
   * allows customization of which animation to use.
   * @returns {Promise} Returns a promise which resolves when the modal has
   * loaded and its entering animation has completed. The resolved promise's
   * value is the instance of the newly created modal.
   */
  open(pageComponent: Type, params={}, opts={}) {
    opts = extend({
      pageType: OVERLAY_TYPE,
      enterAnimation: this.config.get('modalEnter'),
      leaveAnimation: this.config.get('modalLeave'),
    }, opts);

    return this.ctrl.open(pageComponent, params, opts);
  }

  /**
   * Get the instance of a modal. This is usually helpful to getting ahold of a
   * certain modal, from anywhere within the app, and closing it. By calling
   * just `get()` without a `handle` argument, it'll return the active modal
   * on top (it is possible to have multipe modals opened at the same time).
   * If getting just the active modal isn't enough, when creating
   * a modal, it's options can be given a `handle`, which is simply a string-based
   * name for the modal instance. You can later get a reference to that modal's
   * instance by calling this method with the same handle name.
   * @param  [handle]  Optional string name given in the modal's options when it was opened.
   * @returns Returns the instance of the modal if it is found, otherwise `null`.
   */
  get(handle) {
    if (handle) {
      return this.ctrl.getByHandle(handle);
    }
    return this.ctrl.getByType(OVERLAY_TYPE);
  }

}

const OVERLAY_TYPE = 'modal';


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

import {Injectable} from 'angular2/angular2';

import {OverlayController} from '../overlay/overlay-controller';
import {Config} from '../../config/config';
import {Animation} from '../../animations/animation';
import {extend} from 'ionic/util';

/**
 * The Modal is a content pane that can go over the user's current page.
 * Usually used for making a choice or editing an item. A modal can be opened
 * similar to how NavController#push works, where you pass it a Page component,
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
 *  openModal() {
 *    this.modal.open(ContactPage, null, {
 *      enterAnimation: 'my-fade-in',
 *      leaveAnimation: 'my-fade-out',
 *      handle: 'my-modal'
 *    });
 *  }
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
   * TODO
   * @param {TODO} componentType  TODO
   * @param {TODO} [params={}]  TODO
   * @param {TODO} [opts={}]  TODO
   * @returns {Promise} TODO
   */
  open(componentType: Type, params={}, opts={}) {
    opts = extend({
      pageType: OVERLAY_TYPE,
      enterAnimation: this.config.get('modalEnter'),
      leaveAnimation: this.config.get('modalLeave'),
    }, opts);

    return this.ctrl.open(componentType, params, opts);
  }

  /**
   * TODO
   * @param {TODO} handle  TODO
   * @returns {TODO} TODO
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

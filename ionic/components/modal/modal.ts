import {Injectable} from 'angular2/angular2';

import {IonicApp} from '../app/app';
import {IonicConfig} from '../../config/config';
import {OverlayController} from '../overlay/overlay-controller';
import {Animation} from '../../animations/animation';
import * as util from 'ionic/util';

/**
 * @name ionModal
 * @description
 * The Modal is a content pane that can go over the user's main view temporarily. Usually used for making a choice or editing an item.
 *
 * @usage
 * ```ts
 * class MyApp {
 *
 *  constructor(modal: Modal, app: IonicApp, ionicConfig: IonicConfig) {
 *    this.modal = modal;
 *  }
 *
 *  openModal() {
 *    this.modal.open(ContactModal, {
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

  constructor(app: IonicApp, config: IonicConfig) {
    // super(app, {
    //   enterAnimation: config.get('modalEnter') || 'modal-slide-in',
    //   leaveAnimation: config.get('modalLeave') || 'modal-slide-out',
    // })
  }

  /**
   * TODO
   * @param {Type} ComponentType  TODO
   * @param {Object} [opts={}]  TODO
   * @returns {TODO} TODO
   */
  open(ComponentType: Type, opts={}) {
    return this.create(OVERLAY_TYPE, ComponentType, opts);
  }

  /**
   * TODO
   * @param {TODO} handle  TODO
   * @returns {TODO} TODO
   */
  get(handle) {
    if (handle) {
      return this.getByHandle(handle, OVERLAY_TYPE);
    }
    return this.getByType(OVERLAY_TYPE);
  }

}

const OVERLAY_TYPE = 'modal';


/**
 * Animations for modals
 */
class ModalSlideIn extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('cubic-bezier(0.36,0.66,0.04,1)')
      .duration(400)
      .fromTo('translateY', '100%', '0%');
  }
}
Animation.register('modal-slide-in', ModalSlideIn);


class ModalSlideOut extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('ease-out')
      .duration(250)
      .fromTo('translateY', '0%', '100%');
  }
}
Animation.register('modal-slide-out', ModalSlideOut);


class ModalMDSlideIn extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('cubic-bezier(0.36,0.66,0.04,1)')
      .duration(280)
      .fromTo('translateY', '40px', '0px')
      .fadeIn();
  }
}
Animation.register('modal-md-slide-in', ModalMDSlideIn);


class ModalMDSlideOut extends Animation {
  constructor(element) {
    super(element);
    this
      .duration(200)
      .easing('cubic-bezier(0.47,0,0.745,0.715)')
      .fromTo('translateY', '0px', '40px')
      .fadeOut();
  }
}
Animation.register('modal-md-slide-out', ModalMDSlideOut);

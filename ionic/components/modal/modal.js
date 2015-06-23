import {Injectable} from 'angular2/di';

import {Overlay} from '../overlay/overlay';
import {Animation} from '../../animations/animation';
import {IonicApp} from '../app/app';


@Injectable()
export class Modal extends Overlay {

  static get config() {
    return {
      selector: 'ion-modal',
      host: {
        '[style.z-index]': 'zIndex'
      }
    }
  }

  constructor(app: IonicApp) {
    // a modal created by the appInjector will inject an IonicApp
    // a modal created by the user will not
    super(app);

    this.extendOptions({
      enterAnimation: 'modal-slide-in',
      leaveAnimation: 'modal-slide-out'
    });
  }

  open(ComponentType: Type, opts) {
    return this.create(OVERLAY_TYPE, ComponentType, opts);
  }

  get() {
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
      .easing('cubic-bezier(.36,.66,.04,1)')
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

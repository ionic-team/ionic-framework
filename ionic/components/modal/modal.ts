import {Injectable} from 'angular2/angular2';

import {Overlay} from '../overlay/overlay';
import {Animation} from '../../animations/animation';
import {IonicApp} from '../app/app';
import * as util from 'ionic/util';


@Injectable()
export class Modal extends Overlay {
  constructor(app: IonicApp) {
    super(app);
  }

  open(ComponentType: Type, opts={}) {
    let defaults = {
      enterAnimation: 'modal-slide-in',
      leaveAnimation: 'modal-slide-out',
    };

    return this.create(OVERLAY_TYPE, ComponentType, util.extend(defaults, opts));
  }

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

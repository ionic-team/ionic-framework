import {Overlay} from '../overlay/overlay';
import {Animation} from '../../animations/animation';


export class Modal extends Overlay {

  static get config() {
    return {
      selector: 'ion-modal',
      host: {
        '[style.z-index]': 'zIndex'
      }
    }
  }

  constructor() {
    super();
    this.extendOptions({
      enterAnimation: 'modal-slide-in',
      leaveAnimation: 'modal-slide-out'
    });
  }

  /* Static Methods */
  static open(ComponentType: Type, opts) {
    return this.create(overlayType, ComponentType, opts);
  }

  static get() {
    return Modal.getByType(overlayType);
  }

}

const overlayType = 'modal';


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

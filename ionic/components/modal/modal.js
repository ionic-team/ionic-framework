import {Overlay} from '../overlay/overlay';
import {Animation} from '../../animations/animation';


export class Modal extends Overlay {

  constructor() {
    super();
    this.extendOptions({
      enterAnimation: 'modal-slide-in',
      leaveAnimation: 'modal-slide-out'
    });
  }

  /* Static Methods */
  static open(ComponentType: Type, opts) {
    return this.create(ComponentType, opts);
  }

  static get config() {
    return {
      selector: 'ion-modal'
    }
  }

}


/**
 * Animations for modals
 */
class ModalAnimation extends Animation {
  constructor(element) {
    super(element);
    this.easing('cubic-bezier(.36, .66, .04, 1)').duration(400);
  }
}

class ModalSlideIn extends ModalAnimation {
  constructor(element) {
    super(element);
    this
      .fadeIn()
      .fromTo('translateY', '100%', '0%');
  }
}
Animation.register('modal-slide-in', ModalSlideIn);

class ModalSlideOut extends ModalAnimation {
  constructor(element) {
    super(element);
    this
      .fadeOut()
      .fromTo('translateY', '0%', '100%');
  }
}
Animation.register('modal-slide-out', ModalSlideOut);

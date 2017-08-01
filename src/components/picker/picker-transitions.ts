import { Animation } from '../../animations/animation';
import { Transition } from '../../transitions/transition';


/**
 * Animations for pickers
 */
export class PickerSlideIn extends Transition {
  init() {
    let ele = this.enteringView.pageRef().nativeElement;
    let backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
    let wrapper = new Animation(this.plt, ele.querySelector('.picker-wrapper'));

    backdrop.fromTo('opacity', 0.01, 0.26);
    wrapper.fromTo('translateY', '100%', '0%');

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(backdrop).add(wrapper);
  }
}


export class PickerSlideOut extends Transition {
  init() {
    let ele = this.leavingView.pageRef().nativeElement;
    let backdrop = new Animation(this.plt, ele.querySelector('ion-backdrop'));
    let wrapper = new Animation(this.plt, ele.querySelector('.picker-wrapper'));

    backdrop.fromTo('opacity', 0.26, 0);
    wrapper.fromTo('translateY', '0%', '100%');

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add(backdrop).add(wrapper);
  }
}

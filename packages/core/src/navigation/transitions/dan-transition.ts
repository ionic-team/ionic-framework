import { Transition } from './transition';
import { ViewController } from '../view-controller';

import { Animation } from '../../animations/animation';
import { AnimationOptions } from '../../animations/interfaces';

export class DanTransition extends Transition {
  constructor(public enteringView: ViewController, public leavingView: ViewController, opts: AnimationOptions = {}) {
    super(enteringView, leavingView, opts);
  }

  init() {
    super.init();

    const enteringAnimation = new Animation(this.enteringView.element);
    enteringAnimation.fromTo('display', '', '');
    this.add(enteringAnimation);

    if (this.leavingView) {
      const leavingAnimation = new Animation(this.leavingView.element);
      leavingAnimation.fromTo('display', '', 'none');
      this.add(leavingAnimation);
    }
  }
}
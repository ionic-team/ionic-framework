import {Transition} from './transition';
import {Animation} from '../animations/animation';


const DURATION = 500;
const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';

const OPACITY = 'opacity';
const TRANSLATEX = 'translateX';

const OFF_RIGHT = '100%';
const OFF_LEFT = '-33%';
const CENTER = '0%'
const OFF_OPACITY = 0.8;


class IOSTransition extends Transition {

  constructor(nav, opts) {
    super(nav, opts);

    // global duration and easing for all child animations
    this.duration(DURATION);
    this.easing(EASING);

    // entering item moves to center
    this.enteringView
      .to(TRANSLATEX, CENTER)
      .to(OPACITY, 1);

    this.enteringTitle
      .from(OPACITY, 0)
      .to(OPACITY, 1)
      .to(TRANSLATEX, CENTER);

    // if the back button should show, then fade it in
    if (this.entering.enableBack) {
      let enteringBackButton = new Animation(this.entering.backButtonElement())
      enteringBackButton
        .from(OPACITY, 0)
        .to(OPACITY, 1);
      this.add(enteringBackButton);
    }

    // leaving view moves off screen
    this.leavingView
      .from(TRANSLATEX, CENTER)
      .from(OPACITY, 1);

    this.leavingTitle
      .from(TRANSLATEX, CENTER)
      .from(OPACITY, 1);

    let leavingBackButton = new Animation(this.leaving.backButtonElement());
    leavingBackButton
      .from(OPACITY, 1)
      .to(OPACITY, 0);
    this.add(leavingBackButton);

    // set properties depending on direction
    if (opts.direction === 'back') {
      // back direction
      this.enteringView
        .from(TRANSLATEX, OFF_LEFT)
        .from(OPACITY, OFF_OPACITY)
        .to(OPACITY, 1);

      this.enteringTitle
        .from(TRANSLATEX, OFF_LEFT);

      this.leavingView
        .to(TRANSLATEX, OFF_RIGHT)
        .to(OPACITY, 1);

      this.leavingTitle
        .to(TRANSLATEX, OFF_RIGHT)
        .to(OPACITY, 0);

    } else {
      // forward direction
      this.enteringView
        .from(TRANSLATEX, OFF_RIGHT)
        .from(OPACITY, 1);

      this.enteringTitle
        .from(TRANSLATEX, OFF_RIGHT);

      this.leavingView
        .to(TRANSLATEX, OFF_LEFT)
        .to(OPACITY, OFF_OPACITY);

      this.leavingTitle
        .to(TRANSLATEX, OFF_LEFT)
        .to(OPACITY, 0);
    }

  }

}

Transition.register('ios', IOSTransition);

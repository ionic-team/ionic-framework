import {Transition} from './transition';
import {Animation} from '../animations/animation';


const DURATION = 500;
const EASING = 'cubic-bezier(.36,.66,.04,1)';

const OPACITY = 'opacity';
const TRANSLATEX = 'translateX';

const OFF_RIGHT = '100%';
const OFF_LEFT = '-33%';
const CENTER = '0%'
const OFF_OPACITY = 0.8;


class IOSTransition extends Transition {

  constructor(navCtrl, opts) {
    super(navCtrl);

    // global duration and easing for all child animations
    this.duration(DURATION);
    this.easing(EASING);

    // entering item moves to center
    // before starting, set enteringItem to display: block
    this.enteringContent
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
      this.addAnimation(enteringBackButton);
    }

    // leaving view moves off screen
    // when completed, set leaving to display: none
    this.leavingContent
      .from(TRANSLATEX, CENTER)
      .from(OPACITY, 1);

    this.leavingTitle
      .from(TRANSLATEX, CENTER)
      .from(OPACITY, 1);

    let leavingBackButton = new Animation(this.leaving.backButtonElement());
    leavingBackButton
      .from(OPACITY, 1)
      .to(OPACITY, 0);
    this.addAnimation(leavingBackButton);

    // set properties depending on direction
    if (opts.direction === 'back') {
      // back direction
      this.enteringContent
        .from(TRANSLATEX, OFF_LEFT)
        .from(OPACITY, OFF_OPACITY)
        .to(OPACITY, 1);

      this.enteringTitle
        .from(TRANSLATEX, OFF_LEFT);

      this.leavingContent
        .to(TRANSLATEX, OFF_RIGHT)
        .to(OPACITY, 1);

      this.leavingTitle
        .to(TRANSLATEX, OFF_RIGHT)
        .to(OPACITY, 0);

    } else {
      // forward direction
      this.enteringContent
        .from(TRANSLATEX, OFF_RIGHT)
        .from(OPACITY, 1);

      this.enteringTitle
        .from(TRANSLATEX, OFF_RIGHT);

      this.leavingContent
        .to(TRANSLATEX, OFF_LEFT)
        .to(OPACITY, OFF_OPACITY);

      this.leavingTitle
        .to(TRANSLATEX, OFF_LEFT)
        .to(OPACITY, 0);
    }

  }

}

Transition.register('ios', IOSTransition);

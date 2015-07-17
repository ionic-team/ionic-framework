import {Transition} from './transition';
import {Animation} from '../animations/animation';


const DURATION = 6000;
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
      .to(OPACITY, 1)
      .before.setStyles({ zIndex: this.entering.index });

    this.enteringTitle
      .fadeIn()
      .to(TRANSLATEX, CENTER);

    // leaving view moves off screen
    this.leavingView
      .from(TRANSLATEX, CENTER)
      .from(OPACITY, 1)
      .before.setStyles({ zIndex: this.leaving.index });

    this.leavingTitle
      .from(TRANSLATEX, CENTER)
      .from(OPACITY, 1);

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

      if (this.leaving.enableBack() && this.viewWidth() > 200) {
        let leavingBackButtonText = new Animation(this.leaving.backButtonTextElement());
        leavingBackButtonText.fromTo(TRANSLATEX, CENTER, (this.viewWidth() / 2) + 'px');
        this.leavingNavbar.add(leavingBackButtonText);
      }

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

      if (this.entering.enableBack() && this.viewWidth() > 200) {
        let enteringBackButtonText = new Animation(this.entering.backButtonTextElement());
        enteringBackButtonText.fromTo(TRANSLATEX, (this.viewWidth() / 2) + 'px', CENTER);
        this.enteringNavbar.add(enteringBackButtonText);
      }
    }

  }

}

Transition.register('ios', IOSTransition);

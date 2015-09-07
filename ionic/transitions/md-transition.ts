import {Transition} from './transition';
import {Animation} from '../animations/animation';


const DURATION = 300;
const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';

const TRANSLATEY = 'translateY';
const OFF_BOTTOM = '40px';
const CENTER = '0px'


class MaterialTransition extends Transition {

  constructor(nav, opts) {
    super(nav, opts);

    // global duration and easing for all child animations
    this.duration(DURATION);
    this.easing(EASING);

    // entering item moves in bottom to center
    this.enteringView
      .to(TRANSLATEY, CENTER)
      .before.setStyles({ zIndex: this.entering.index });

    // entering item moves in bottom to center
    this.enteringNavbar
      .to(TRANSLATEY, CENTER)
      .before.setStyles({ zIndex: this.entering.index + 10 });

    // leaving view stays put
    this.leavingView
      .before.setStyles({ zIndex: this.leaving.index });

    this.leavingNavbar
      .before.setStyles({ zIndex: this.leaving.index + 10 });

    // set properties depending on direction
    if (opts.direction === 'back') {
      // back direction
      this.enteringView
        .from(TRANSLATEY, CENTER);

      this.enteringNavbar
        .from(TRANSLATEY, CENTER);

      // leaving view goes center to bottom
      this.leavingView
        .fromTo(TRANSLATEY, CENTER, OFF_BOTTOM)
        .fadeOut();

      this.leavingNavbar
        .fromTo(TRANSLATEY, CENTER, OFF_BOTTOM)
        .fadeOut();

    } else {
      // forward direction
      this.enteringView
        .from(TRANSLATEY, OFF_BOTTOM)
        .fadeIn();

      this.enteringNavbar
        .from(TRANSLATEY, OFF_BOTTOM)
        .fadeIn();
    }

  }

}

Transition.register('md', MaterialTransition);

import {Transition} from './transition';
import {Animation} from '../animations/animation';


const DURATION = 300;
const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';

const TRANSLATEY = 'translateY';
const OFF_BOTTOM = '5%';
const CENTER = '0%'


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

    // entering title fades in
    this.enteringTitle
      .fadeIn();

    // leaving view stays put
    this.leavingView
      .before.setStyles({ zIndex: this.leaving.index });

    // leaving title fades out
    this.leavingTitle
      .fadeOut();

    // set properties depending on direction
    if (opts.direction === 'back') {
      // back direction
      this.enteringView
        .from(TRANSLATEY, CENTER);

      this.leavingNavbar
        .before.addClass('transparent-navbar')
        .after.removeClass('transparent-navbar');

      this.leavingTitle
        .fadeOut();

      // leaving view goes center to bottom
      this.leavingView
        .fromTo(TRANSLATEY, CENTER, OFF_BOTTOM)
        .fadeOut();

      if (this.leaving.enableBack()) {
        let leavingBackButtonText = new Animation(this.leaving.backButtonTextElement());
        leavingBackButtonText.fadeOut();
        this.leavingNavbar.add(leavingBackButtonText);
      }

    } else {
      // forward direction
      this.enteringView
        .from(TRANSLATEY, OFF_BOTTOM)
        .fadeIn();

      this.enteringNavbar
        .before.addClass('transparent-navbar')
        .after.removeClass('transparent-navbar');

      if (this.entering.enableBack()) {
        let enteringBackButtonText = new Animation(this.entering.backButtonTextElement());
        enteringBackButtonText.fadeIn();
        this.enteringNavbar.add(enteringBackButtonText);
      }
    }

  }

}

Transition.register('md', MaterialTransition);

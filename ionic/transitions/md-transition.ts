import {Transition} from './transition';
import {Animation} from '../animations/animation';

const TRANSLATEY = 'translateY';
const OFF_BOTTOM = '40px';
const CENTER = '0px'


class MaterialTransition extends Transition {

  constructor(nav, opts) {
    super(nav, opts);

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
      this.duration(200).easing('cubic-bezier(0.47,0,0.745,0.715)');

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
      this.duration(280).easing('cubic-bezier(0.36,0.66,0.04,1)');

      this.enteringView
        .from(TRANSLATEY, OFF_BOTTOM)
        .fadeIn();

      this.enteringNavbar
        .from(TRANSLATEY, OFF_BOTTOM)
        .fadeIn();
    }

    let itemLength = nav.length();
    if (nav.tabs && (itemLength === 1 || itemLength === 2)) {
      let tabBarEle = nav.tabs.elementRef.nativeElement.querySelector('.tab-bar-container');
      let tabBar = new Animation(tabBarEle);

      if (itemLength === 1 && opts.direction == 'back') {
        tabBar.fromTo('height', '0px', '69px');
        tabBar.fadeIn();

      } else if (itemLength === 2 && opts.direction == 'forward') {
        tabBar.fromTo('height', '69px', '0px');
        tabBar.fadeOut();
      }

      this.add(tabBar);
    }

  }

}

Transition.register('md', MaterialTransition);

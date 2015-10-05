import {Transition} from './transition';
import {Animation} from '../animations/animation';

const TRANSLATEY = 'translateY';
const OFF_BOTTOM = '40px';
const CENTER = '0px'


class MaterialTransition extends Transition {

  constructor(nav, opts) {
    opts.renderDelay = 160;
    super(nav, opts);

    // entering item moves in bottom to center
    this.enteringContent
      .to(TRANSLATEY, CENTER)
      .before.setStyles({ zIndex: this.enteringZ });

    // entering item moves in bottom to center
    this.enteringNavbar
      .to(TRANSLATEY, CENTER)
      .before.setStyles({ zIndex: this.enteringZ + 10 });

    // leaving view stays put
    this.leavingContent
      .before.setStyles({ zIndex: this.leavingZ });

    this.leavingNavbar
      .before.setStyles({ zIndex: this.leavingZ + 10 });

    // set properties depending on direction
    if (opts.direction === 'back') {
      this.duration(200).easing('cubic-bezier(0.47,0,0.745,0.715)');

      // back direction
      this.enteringContent
        .from(TRANSLATEY, CENTER);

      this.enteringNavbar
        .from(TRANSLATEY, CENTER);

      // leaving view goes center to bottom
      this.leavingContent
        .fromTo(TRANSLATEY, CENTER, OFF_BOTTOM)
        .fadeOut();

      this.leavingNavbar
        .fromTo(TRANSLATEY, CENTER, OFF_BOTTOM)
        .fadeOut();

    } else {
      // forward direction
      this.duration(280).easing('cubic-bezier(0.36,0.66,0.04,1)');

      this.enteringContent
        .from(TRANSLATEY, OFF_BOTTOM)
        .fadeIn();

      this.enteringNavbar
        .from(TRANSLATEY, OFF_BOTTOM)
        .fadeIn();
    }

    let viewLength = nav.length();
    if (nav.tabs && (viewLength === 1 || viewLength === 2)) {
      let tabBarEle = nav.tabs.elementRef.nativeElement.querySelector('.tab-bar-container');
      let tabBar = new Animation(tabBarEle);

      if (viewLength === 1 && opts.direction == 'back') {
        tabBar.fromTo('height', '0px', '69px');
        tabBar.fadeIn();

      } else if (viewLength === 2 && opts.direction == 'forward') {
        tabBar.fromTo('height', '69px', '0px');
        tabBar.fadeOut();
      }

      this.add(tabBar);
    }

  }

}

Transition.register('md', MaterialTransition);

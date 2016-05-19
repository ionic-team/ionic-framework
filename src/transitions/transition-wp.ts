import {Animation} from '../animations/animation';
import {Transition, TransitionOptions} from './transition';
import {ViewController} from '../components/nav/view-controller';

const SHOW_BACK_BTN_CSS = 'show-back-button';
const SCALE_SMALL = .95;


class WPTransition extends Transition {

  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    // what direction is the transition going
    let backDirection = (opts.direction === 'back');

    // do they have navbars?
    let enteringHasNavbar = enteringView.hasNavbar();
    let leavingHasNavbar = leavingView && leavingView.hasNavbar();

    // entering content scale from smaller to larger
    let enteringPage = new Animation(enteringView.pageRef());
    enteringPage.before.addClass('show-page');
    this.add(enteringPage);

    if (backDirection) {
      this.duration(opts.duration || 120).easing('cubic-bezier(0.47,0,0.745,0.715)');
      enteringPage.before.clearStyles(['scale']);

    } else {
      this.duration(opts.duration || 280).easing('cubic-bezier(0,0 0.05,1)');
      enteringPage
        .fromTo('scale', SCALE_SMALL, 1, true)
        .fadeIn();
    }

    if (enteringHasNavbar) {
      let enteringNavBar = new Animation(enteringView.navbarRef());
      enteringNavBar.before.addClass('show-navbar');
      this.add(enteringNavBar);

      let enteringBackButton = new Animation(enteringView.backBtnRef());
      this.add(enteringBackButton);
      if (enteringView.enableBack()) {
        enteringBackButton.before.addClass(SHOW_BACK_BTN_CSS);
      } else {
        enteringBackButton.before.removeClass(SHOW_BACK_BTN_CSS);
      }
    }

    // setup leaving view
    if (leavingView && backDirection) {
      // leaving content
      this.duration(opts.duration || 200).easing('cubic-bezier(0.47,0,0.745,0.715)');
      let leavingPage = new Animation(leavingView.pageRef());
      this.add(leavingPage.fromTo('scale', 1, SCALE_SMALL).fadeOut());
    }

  }

}

Transition.register('wp-transition', WPTransition);

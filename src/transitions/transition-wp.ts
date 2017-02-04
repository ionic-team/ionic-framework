import { Animation } from '../animations/animation';
import { isPresent } from '../util/util';
import { PageTransition } from './page-transition';

const SHOW_BACK_BTN_CSS = 'show-back-button';
const SCALE_SMALL = .95;


export class WPTransition extends PageTransition {

  init() {
    super.init();

    const plt = this.plt;
    const enteringView = this.enteringView;
    const leavingView = this.leavingView;
    const opts = this.opts;

    // what direction is the transition going
    const backDirection = (opts.direction === 'back');

    if (enteringView) {
      if (backDirection) {
        this.duration(isPresent(opts.duration) ? opts.duration : 120).easing('cubic-bezier(0.47,0,0.745,0.715)');
        this.enteringPage.beforeClearStyles(['scale']);

      } else {
        this.duration(isPresent(opts.duration) ? opts.duration : 280).easing('cubic-bezier(0,0,0.05,1)');
        this.enteringPage
          .fromTo('scale', SCALE_SMALL, 1, true)
          .fromTo('opacity', 0.01, 1, true);
      }

      if (enteringView.hasNavbar()) {
        const enteringPageEle: Element = enteringView.pageRef().nativeElement;
        const enteringNavbarEle: Element = enteringPageEle.querySelector('ion-navbar');

        const enteringNavBar = new Animation(plt, enteringNavbarEle);
        this.add(enteringNavBar);

        const enteringBackButton = new Animation(plt, enteringNavbarEle.querySelector('.back-button'));
        this.add(enteringBackButton);
        if (enteringView.enableBack()) {
          enteringBackButton.beforeAddClass(SHOW_BACK_BTN_CSS);
        } else {
          enteringBackButton.beforeRemoveClass(SHOW_BACK_BTN_CSS);
        }
      }
    }

    // setup leaving view
    if (leavingView && backDirection) {
      // leaving content
      this.duration(opts.duration || 200).easing('cubic-bezier(0.47,0,0.745,0.715)');
      const leavingPage = new Animation(plt, leavingView.pageRef());
      this.add(leavingPage.fromTo('scale', 1, SCALE_SMALL).fromTo('opacity', 0.99, 0));
    }

  }

}

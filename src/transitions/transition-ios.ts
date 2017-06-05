import { Animation } from '../animations/animation';
import { isPresent } from '../util/util';
import { PageTransition } from './page-transition';

const DURATION = 500;
const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
const OPACITY = 'opacity';
const TRANSFORM = 'transform';
const TRANSLATEX = 'translateX';
const CENTER = '0%';
const OFF_OPACITY = 0.8;
const SHOW_BACK_BTN_CSS = 'show-back-button';


export class IOSTransition extends PageTransition {

  init() {
    super.init();

    const plt = this.plt;
    const OFF_RIGHT = plt.isRTL ? '-99.5%' : '99.5%';
    const OFF_LEFT = plt.isRTL ? '33%' : '-33%';
    const enteringView = this.enteringView;
    const leavingView = this.leavingView;
    const opts = this.opts;

    this.duration(isPresent(opts.duration) ? opts.duration : DURATION);
    this.easing(isPresent(opts.easing) ? opts.easing : EASING);

    const backDirection = (opts.direction === 'back');
    const enteringHasNavbar = (enteringView && enteringView.hasNavbar());
    const leavingHasNavbar = (leavingView && leavingView.hasNavbar());

    if (enteringView) {
      // get the native element for the entering page
      const enteringPageEle: Element = enteringView.pageRef().nativeElement;

      // entering content
      const enteringContent = new Animation(plt, enteringView.contentRef());
      enteringContent.element(enteringPageEle.querySelectorAll('ion-header > *:not(ion-navbar),ion-footer > *'));
      this.add(enteringContent);

      if (backDirection) {
        // entering content, back direction
        enteringContent
          .fromTo(TRANSLATEX, OFF_LEFT, CENTER, true)
          .fromTo(OPACITY, OFF_OPACITY, 1, true);

      } else {
        // entering content, forward direction
        enteringContent
          .beforeClearStyles([OPACITY])
          .fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
      }

      if (enteringHasNavbar) {
        // entering page has a navbar
        const enteringNavbarEle = enteringPageEle.querySelector('ion-navbar');

        const enteringNavBar = new Animation(plt, enteringNavbarEle);
        this.add(enteringNavBar);

        const enteringTitle = new Animation(plt, enteringNavbarEle.querySelector('ion-title'));
        const enteringNavbarItems = new Animation(plt, enteringNavbarEle.querySelectorAll('ion-buttons,[menuToggle]'));
        const enteringNavbarBg = new Animation(plt, enteringNavbarEle.querySelector('.toolbar-background'));
        const enteringBackButton = new Animation(plt, enteringNavbarEle.querySelector('.back-button'));
        enteringNavBar
          .add(enteringTitle)
          .add(enteringNavbarItems)
          .add(enteringNavbarBg)
          .add(enteringBackButton);

        enteringTitle.fromTo(OPACITY, 0.01, 1, true);
        enteringNavbarItems.fromTo(OPACITY, 0.01, 1, true);

        // set properties depending on direction
        if (backDirection) {
          // entering navbar, back direction
          enteringTitle.fromTo(TRANSLATEX, OFF_LEFT, CENTER, true);

          if (enteringView.enableBack()) {
            // back direction, entering page has a back button
            enteringBackButton
              .beforeAddClass(SHOW_BACK_BTN_CSS)
              .fromTo(OPACITY, 0.01, 1, true);
          }

        } else {
          // entering navbar, forward direction
          enteringTitle.fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);

          enteringNavbarBg
            .beforeClearStyles([OPACITY])
            .fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);

          if (enteringView.enableBack()) {
            // forward direction, entering page has a back button
            enteringBackButton
              .beforeAddClass(SHOW_BACK_BTN_CSS)
              .fromTo(OPACITY, 0.01, 1, true);

            const enteringBackBtnText = new Animation(plt, enteringNavbarEle.querySelector('.back-button-text'));
            enteringBackBtnText.fromTo(TRANSLATEX, (plt.isRTL ? '-100px' : '100px'), '0px');
            enteringNavBar.add(enteringBackBtnText);

          } else {
            enteringBackButton.beforeRemoveClass(SHOW_BACK_BTN_CSS);
          }
        }
      }
    }

    // setup leaving view
    if (leavingView && leavingView.pageRef()) {
      // leaving content
      const leavingPageEle: Element = leavingView.pageRef().nativeElement;

      const leavingContent = new Animation(plt, leavingView.contentRef());
      leavingContent.element(leavingPageEle.querySelectorAll('ion-header > *:not(ion-navbar),ion-footer > *'));
      this.add(leavingContent);

      if (backDirection) {
        // leaving content, back direction
        leavingContent
          .beforeClearStyles([OPACITY])
          .fromTo(TRANSLATEX, CENTER, (plt.isRTL ? '-100%' : '100%'));

      } else {
        // leaving content, forward direction
        leavingContent
          .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
          .fromTo(OPACITY, 1, OFF_OPACITY)
          .afterClearStyles([TRANSFORM, OPACITY]);
      }

      if (leavingHasNavbar) {
        // leaving page has a navbar
        const leavingNavbarEle: Element = leavingPageEle.querySelector('ion-navbar');

        const leavingNavBar = new Animation(plt, leavingNavbarEle);
        const leavingTitle = new Animation(plt, leavingNavbarEle.querySelector('ion-title'));
        const leavingNavbarItems = new Animation(plt, leavingNavbarEle.querySelectorAll('ion-buttons,[menuToggle]'));
        const leavingNavbarBg = new Animation(plt, leavingNavbarEle.querySelector('.toolbar-background'));
        const leavingBackButton = new Animation(plt, leavingNavbarEle.querySelector('.back-button'));

        leavingNavBar
          .add(leavingTitle)
          .add(leavingNavbarItems)
          .add(leavingBackButton)
          .add(leavingNavbarBg);
        this.add(leavingNavBar);

        // fade out leaving navbar items
        leavingBackButton.fromTo(OPACITY, 0.99, 0);
        leavingTitle.fromTo(OPACITY, 0.99, 0);
        leavingNavbarItems.fromTo(OPACITY, 0.99, 0);

        if (backDirection) {
          // leaving navbar, back direction
          leavingTitle.fromTo(TRANSLATEX, CENTER, (plt.isRTL ? '-100%' : '100%'));

          // leaving navbar, back direction, and there's no entering navbar
          // should just slide out, no fading out
          leavingNavbarBg
            .beforeClearStyles([OPACITY])
            .fromTo(TRANSLATEX, CENTER, (plt.isRTL ? '-100%' : '100%'));

          let leavingBackBtnText = new Animation(plt, leavingNavbarEle.querySelector('.back-button-text'));
          leavingBackBtnText.fromTo(TRANSLATEX, CENTER, (plt.isRTL ? -300 : 300) + 'px');
          leavingNavBar.add(leavingBackBtnText);

        } else {
          // leaving navbar, forward direction
          leavingTitle
            .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
            .afterClearStyles([TRANSFORM]);

          leavingBackButton.afterClearStyles([OPACITY]);
          leavingTitle.afterClearStyles([OPACITY]);
          leavingNavbarItems.afterClearStyles([OPACITY]);
        }
      }

    }
  }

}

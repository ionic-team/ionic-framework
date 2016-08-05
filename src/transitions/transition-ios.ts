import { Animation, AnimationOptions } from '../animations/animation';
import { PageTransition } from './page-transition';
import { ViewController } from '../components/nav/view-controller';

const DURATION = 500;
const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
const OPACITY = 'opacity';
const TRANSLATEX = 'translateX';
const OFF_RIGHT = '99.5%';
const OFF_LEFT = '-33%';
const CENTER = '0%';
const OFF_OPACITY = 0.8;
const SHOW_BACK_BTN_CSS = 'show-back-button';


class IOSTransition extends PageTransition {

  init(enteringView: ViewController, leavingView: ViewController, opts: AnimationOptions) {
    this.duration(opts.duration || DURATION);
    this.easing(opts.easing || EASING);

    // get the native element for the entering page
    let enteringPageEle: Element = enteringView.pageElementRef().nativeElement;

    // what direction is the transition going
    let backDirection = (opts.direction === 'back');

    // do they have navbars?
    let enteringHasNavbar = enteringView.hasNavbar();
    let leavingHasNavbar = (leavingView && leavingView.hasNavbar());

    // entering content
    let enteringContent = new Animation(enteringPageEle.querySelector('ion-content'));
    enteringContent.element(enteringView.toolbarRefs());
    this.add(enteringContent);

    if (backDirection) {
      // entering content, back direction
      enteringContent
        .fromTo(TRANSLATEX, OFF_LEFT, CENTER, true)
        .fromTo(OPACITY, OFF_OPACITY, 1, true);

    } else {
      // entering content, forward direction
      enteringContent
        .before.clearStyles([OPACITY])
        .fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
    }

    if (enteringHasNavbar) {
      // entering page has a navbar
      let enteringNavbarEle = enteringPageEle.querySelector('ion-navbar');

      let enteringNavBar = new Animation(enteringNavbarEle);
      this.add(enteringNavBar);

      let enteringTitle = new Animation(enteringNavbarEle.querySelector('ion-title'));
      let enteringNavbarItems = new Animation(enteringNavbarEle.querySelectorAll('ion-buttons,[menuToggle]'));
      let enteringNavbarBg = new Animation(enteringNavbarEle.querySelector('.toolbar-background'));
      let enteringBackButton = new Animation(enteringNavbarEle.querySelector('.back-button'));
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
            .before.addClass(SHOW_BACK_BTN_CSS)
            .fromTo(OPACITY, 0.01, 1, true);
        }

      } else {
        // entering navbar, forward direction
        enteringTitle.fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);

        if (leavingHasNavbar) {
          // entering navbar, forward direction, and there's a leaving navbar
          // should just fade in, no sliding
          enteringNavbarBg
            .before.clearStyles([TRANSLATEX])
            .fromTo(OPACITY, 0.01, 1, true);

        } else {
          // entering navbar, forward direction, and there's no leaving navbar
          // should just slide in, no fading in
          enteringNavbarBg
            .before.clearStyles([OPACITY])
            .fromTo(TRANSLATEX, OFF_RIGHT, CENTER, true);
        }


        if (enteringView.enableBack()) {
          // forward direction, entering page has a back button
          enteringBackButton
            .before.addClass(SHOW_BACK_BTN_CSS)
            .fromTo(OPACITY, 0.01, 1, true);

          let enteringBackBtnText = new Animation(enteringNavbarEle.querySelector('.back-button-text'));
          enteringBackBtnText.fromTo(TRANSLATEX, '100px', '0px');
          enteringNavBar.add(enteringBackBtnText);

        } else {
          enteringBackButton.before.removeClass(SHOW_BACK_BTN_CSS);
        }
      }
    }

    // setup leaving view
    if (leavingView && leavingView.pageElementRef()) {
      // leaving content
      let leavingPageEle: Element = leavingView.pageElementRef().nativeElement;

      let leavingContent = new Animation(leavingPageEle.querySelector('ion-content'));
      leavingContent.element(leavingView.toolbarRefs());
      this.add(leavingContent);

      if (backDirection) {
        // leaving content, back direction
        leavingContent
          .before.clearStyles([OPACITY])
          .fromTo(TRANSLATEX, CENTER, '100%');

      } else {
        // leaving content, forward direction
        leavingContent
          .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
          .fromTo(OPACITY, 1, OFF_OPACITY);
      }

      if (leavingHasNavbar) {
        // leaving page has a navbar
        let leavingNavbarEle: Element = leavingPageEle.querySelector('ion-navbar');

        let leavingNavBar = new Animation(leavingNavbarEle);
        let leavingTitle = new Animation(leavingNavbarEle.querySelector('ion-title'));
        let leavingNavbarItems = new Animation(leavingNavbarEle.querySelectorAll('ion-buttons,[menuToggle]'));
        let leavingNavbarBg = new Animation(leavingNavbarEle.querySelector('.back-button'));
        let leavingBackButton = new Animation(leavingNavbarEle.querySelector('.back-button'));

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
          leavingTitle.fromTo(TRANSLATEX, CENTER, '100%');

          if (enteringHasNavbar) {
            // leaving navbar, back direction, and there's an entering navbar
            // should just fade out, no sliding
            leavingNavbarBg
              .before.clearStyles([TRANSLATEX])
              .fromTo('opacity', 0.99, 0);

          } else {
            // leaving navbar, back direction, and there's no entering navbar
            // should just slide out, no fading out
            leavingNavbarBg
              .before.clearStyles([OPACITY])
              .fromTo(TRANSLATEX, CENTER, '100%');
          }

          let leavingBackBtnText = new Animation(leavingNavbarEle.querySelector('.back-button-text'));
          leavingBackBtnText.fromTo(TRANSLATEX, CENTER, (300) + 'px');
          leavingNavBar.add(leavingBackBtnText);

        } else {
          // leaving navbar, forward direction
          leavingTitle.fromTo(TRANSLATEX, CENTER, OFF_LEFT);
        }
      }

    }
  }

}

PageTransition.register('ios-transition', IOSTransition);

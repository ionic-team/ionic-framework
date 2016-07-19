import { Animation } from '../animations/animation';
import { PageTransition } from './page-transition';
import { TransitionOptions } from './transition';
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

  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(enteringView, leavingView, opts);

    this.duration(opts.duration || DURATION);
    this.easing(opts.easing || EASING);

    // what direction is the transition going
    let backDirection = (opts.direction === 'back');

    // do they have navbars?
    let enteringHasNavbar = enteringView.hasNavbar();
    let leavingHasNavbar = leavingView && leavingView.hasNavbar();

    // entering content
    let enteringContent = new Animation(enteringView.contentRef());
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
      let enteringNavBar = new Animation(enteringView.navbarRef());
      enteringNavBar.before.addClass('show-navbar');
      this.add(enteringNavBar);

      let enteringTitle = new Animation(enteringView.titleRef());
      let enteringNavbarItems = new Animation(enteringView.navbarItemRefs());
      let enteringNavbarBg = new Animation(enteringView.navbarBgRef());
      let enteringBackButton = new Animation(enteringView.backBtnRef());
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

          let enteringBackBtnText = new Animation(enteringView.backBtnTextRef());
          enteringBackBtnText.fromTo(TRANSLATEX, '100px', '0px');
          enteringNavBar.add(enteringBackBtnText);

        } else {
          enteringBackButton.before.removeClass(SHOW_BACK_BTN_CSS);
        }
      }
    }

    // setup leaving view
    if (leavingView) {
      // leaving content
      let leavingContent = new Animation(leavingView.contentRef());
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
        let leavingNavBar = new Animation(leavingView.navbarRef());
        let leavingBackButton = new Animation(leavingView.backBtnRef());
        let leavingTitle = new Animation(leavingView.titleRef());
        let leavingNavbarItems = new Animation(leavingView.navbarItemRefs());
        let leavingNavbarBg = new Animation(leavingView.navbarBgRef());

        leavingNavBar
          .add(leavingBackButton)
          .add(leavingTitle)
          .add(leavingNavbarItems)
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

          let leavingBackBtnText = new Animation(leavingView.backBtnTextRef());
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

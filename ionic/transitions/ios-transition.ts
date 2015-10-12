import {Transition} from './transition';
import {Animation} from '../animations/animation';

const DURATION = 550;
const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
const OPACITY = 'opacity';
const TRANSLATEX = 'translateX';
const OFF_RIGHT = '99.5%';
const OFF_LEFT = '-33%';
const CENTER = '0%'
const OFF_OPACITY = 0.8;
const SHOW_NAVBAR_CSS = 'show-navbar';
const SHOW_VIEW_CSS = 'show-view';
const SHOW_BACK_BTN_CSS = 'show-back-button';


class IOSTransition extends Animation {

  constructor(navCtrl, opts) {
    super(null, opts);

    this.duration(DURATION);
    this.easing(EASING);

    // what direction is the transition going
    let backDirection = (opts.direction === 'back');

    // get entering/leaving views
    let enteringView = navCtrl.getStagedEnteringView();
    let leavingView = navCtrl.getStagedLeavingView();

    // do they have navbars?
    let enteringHasNavbar = enteringView.hasNavbar();
    let leavingHasNavbar = leavingView && leavingView.hasNavbar();


    // entering content
    let enteringContent = new Animation(enteringView.contentRef());
    enteringContent
      .before.addClass(SHOW_VIEW_CSS)
      .before.setStyles({ zIndex: enteringView.index });
    this.add(enteringContent);

    if (backDirection) {
      // back direction
      enteringContent
        .fromTo(TRANSLATEX, OFF_LEFT, CENTER)
        .fromTo(OPACITY, OFF_OPACITY, 1);

    } else {
      // forward direction
      enteringContent
        .fromTo(TRANSLATEX, OFF_RIGHT, CENTER)
        .fromTo(OPACITY, 1, 1);
    }


    // entering navbar
    if (enteringHasNavbar) {
      let enteringNavBar = new Animation(enteringView.navbarRef());
      enteringNavBar.before.addClass(SHOW_NAVBAR_CSS);
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

      enteringTitle.fadeIn();
      enteringNavbarItems.fadeIn();

      // set properties depending on direction
      if (backDirection) {
        // back direction
        enteringTitle.fromTo(TRANSLATEX, OFF_LEFT, CENTER);
        enteringNavbarBg.fromTo(TRANSLATEX, OFF_LEFT, CENTER);

      } else {
        // forward direction
        enteringTitle.fromTo(TRANSLATEX, OFF_RIGHT, CENTER);
        enteringNavbarBg.fromTo(TRANSLATEX, OFF_RIGHT, CENTER);

        if (enteringView.enableBack()) {
          enteringBackButton.before.addClass(SHOW_BACK_BTN_CSS);
          enteringBackButton.fadeIn();

          let enteringBackBtnText = new Animation(enteringView.backBtnTextRef());
          enteringBackBtnText.fromTo(TRANSLATEX, '150px', '0px');
          enteringNavBar.add(enteringBackBtnText);
        }
      }
    }


    // setup leaving view
    if (leavingView) {
      // leaving content
      let leavingContent = new Animation(leavingView.contentRef());
      this.add(leavingContent);
      leavingContent
        .before.addClass(SHOW_VIEW_CSS)
        .before.setStyles({ zIndex: leavingView.index });

      if (backDirection) {
        leavingContent
          .fromTo(TRANSLATEX, CENTER, '100%')
          .fromTo(OPACITY, 1, 1);

      } else {
        leavingContent
          .fromTo(TRANSLATEX, CENTER, OFF_LEFT)
          .fromTo(OPACITY, 1, OFF_OPACITY);
      }

      if (leavingHasNavbar) {
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

        leavingBackButton
          .after.removeClass(SHOW_BACK_BTN_CSS)
          .fadeOut();

        leavingTitle.fadeOut();
        leavingNavbarItems.fadeOut();

        // set properties depending on direction
        if (backDirection) {
          // back direction
          leavingTitle.fromTo(TRANSLATEX, CENTER, '100%');
          leavingNavbarBg.fromTo(TRANSLATEX, CENTER, '100%');

          let leavingBackBtnText = new Animation(leavingView.backBtnTextRef());
          leavingBackBtnText.fromTo(TRANSLATEX, CENTER, (300) + 'px');
          leavingNavBar.add(leavingBackBtnText);

        } else {
          // forward direction
          leavingTitle.fromTo(TRANSLATEX, CENTER, OFF_LEFT);
        }
      }

    }
  }

}

Transition.register('ios', IOSTransition);

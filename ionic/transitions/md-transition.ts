import {Transition} from './transition';
import {Animation} from '../animations/animation';

const TRANSLATEY = 'translateY';
const OFF_BOTTOM = '40px';
const CENTER = '0px'
const SHOW_NAVBAR_CSS = 'show-navbar';
const SHOW_VIEW_CSS = 'show-view';
const SHOW_BACK_BTN_CSS = 'show-back-button';
const TABBAR_HEIGHT = '69px';


class MDTransition extends Animation {

  constructor(navCtrl, opts) {
    opts.renderDelay = 160;
    super(null, opts);

    // what direction is the transition going
    let backDirection = (opts.direction === 'back');

    // get entering/leaving views
    let enteringView = navCtrl.getStagedEnteringView();
    let leavingView = navCtrl.getStagedLeavingView();

    // do they have navbars?
    let enteringHasNavbar = enteringView.hasNavbar();
    let leavingHasNavbar = leavingView && leavingView.hasNavbar();


    // entering content item moves in bottom to center
    let enteringContent = new Animation(enteringView.contentRef());
    enteringContent
      .before.addClass(SHOW_VIEW_CSS)
      .before.setStyles({ zIndex: enteringView.index });
    this.add(enteringContent);

    if (backDirection) {
      this.duration(200).easing('cubic-bezier(0.47,0,0.745,0.715)');
      enteringContent.fromTo(TRANSLATEY, CENTER, CENTER);

    } else {
      this.duration(280).easing('cubic-bezier(0.36,0.66,0.04,1)');
      enteringContent
        .fromTo(TRANSLATEY, OFF_BOTTOM, CENTER)
        .fadeIn();
    }


    // entering navbar
    if (enteringHasNavbar) {
      let enteringNavBar = new Animation(enteringView.navbarRef());
      enteringNavBar
        .before.addClass(SHOW_NAVBAR_CSS)
        .before.setStyles({ zIndex: enteringView.index + 10 });
      this.add(enteringNavBar);

      if (backDirection) {
        enteringNavBar.fromTo(TRANSLATEY, CENTER, CENTER);

      } else {
        enteringNavBar
          .fromTo(TRANSLATEY, OFF_BOTTOM, CENTER)
          .fadeIn();
      }

      if (enteringView.enableBack()) {
        let enteringBackButton = new Animation(enteringView.backBtnRef());
        enteringBackButton.before.addClass(SHOW_BACK_BTN_CSS);
        enteringNavBar.add(enteringBackButton);
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
        this.duration(200).easing('cubic-bezier(0.47,0,0.745,0.715)');
        leavingContent
          .fromTo(TRANSLATEY, CENTER, OFF_BOTTOM)
          .fadeOut();
      }


      if (leavingHasNavbar) {
        if (backDirection) {
          let leavingNavBar = new Animation(leavingView.navbarRef());
          this.add(leavingNavBar);

          leavingNavBar
            .before.setStyles({ zIndex: leavingView.index + 10 })
            .fadeOut();
        }

      }
    }

    let viewLength = navCtrl.length();
    if ((viewLength === 1 || viewLength === 2) && navCtrl.tabs) {
      let tabBarEle = navCtrl.tabs.elementRef.nativeElement.querySelector('ion-tab-bar-section');
      let tabBar = new Animation(tabBarEle);

      if (viewLength === 1 && backDirection) {
        tabBar
          .fromTo('height', '0px', TABBAR_HEIGHT)
          .fadeIn();

      } else if (viewLength === 2 && !backDirection) {
        tabBar
          .fromTo('height', TABBAR_HEIGHT, '0px')
          .fadeOut();
      }

      this.add(tabBar);
    }

  }

}

Transition.register('md', MDTransition);

import {Animation} from '../animations/animation';
import {IonicConfig} from  '../config/config';

const SHOW_NAVBAR_CSS = 'show-navbar';
const SHOW_VIEW_CSS = 'show-view';
const SHOW_BACK_BUTTON = 'show-back-button';

let TransitionRegistry = {};


export class Transition extends Animation {

  constructor(nav, opts) {
    super();

    // get the entering and leaving items
    let enteringView = this.entering = nav.getStagedEnteringView();
    let leavingView = this.leaving = nav.getStagedLeavingView();

    // create animation for the entering item's "ion-view" element
    this.enteringView = new Animation(enteringView.viewElementRef());
    this.enteringView.before.addClass(SHOW_VIEW_CSS);

    this.enteringView.onPlay(() => {
      enteringView.postRender();
    });

    this.add(this.enteringView);

    if (opts.navbar !== false) {

      let enteringNavbar = this.enteringNavbar = new Animation(enteringView.navbarRef());
      enteringNavbar.before.addClass(SHOW_NAVBAR_CSS);

      if (enteringView.enableBack()) {
        // only animate in the back button if the entering view has it enabled
        let enteringBackButton = this.enteringBackButton = new Animation(enteringView.backBtnRef());
        enteringBackButton
          .before.addClass(SHOW_BACK_BUTTON)
          .fadeIn();
        enteringNavbar.add(enteringBackButton);
      }

      this.enteringTitle = new Animation(enteringView.titleRef());
      enteringNavbar.add(this.enteringTitle);
      this.add(enteringNavbar);

      this.enteringNavbarItems = new Animation(enteringView.navbarItemRefs());
      enteringNavbar.add(this.enteringNavbarItems.fadeIn());

      this.enteringNavbarBackground = new Animation(enteringView.navbarBackgroundRef());
      enteringNavbar.add(this.enteringNavbarBackground);
    }


    if (leavingView) {
      // setup the leaving item if one exists (initial viewing wouldn't have a leaving item)
      this.leavingView = new Animation(leavingView.viewElementRef());
      this.leavingView.after.removeClass(SHOW_VIEW_CSS);

      let leavingNavbar = this.leavingNavbar = new Animation(leavingView.navbarRef());
      leavingNavbar.after.removeClass(SHOW_NAVBAR_CSS);

      let leavingBackButton = this.leavingBackButton = new Animation(leavingView.backBtnRef());
      leavingBackButton
        .after.removeClass(SHOW_BACK_BUTTON)
        .fadeOut();
      leavingNavbar.add(leavingBackButton);

      this.leavingTitle = new Animation(leavingView.titleRef());
      leavingNavbar.add(this.leavingTitle);

      this.leavingNavbarItems = new Animation(leavingView.navbarItemRefs());
      leavingNavbar.add(this.leavingNavbarItems.fadeOut());

      this.leavingNavbarBackground = new Animation(leavingView.navbarBackgroundRef());
      leavingNavbar.add(this.leavingNavbarBackground);

      this.add(this.leavingView, leavingNavbar);
    }

  }

  viewWidth() {
    // TODO: MAKE MORE BETTER
    return this._w || (this._w = this.leaving && this.leaving.viewElementRef().nativeElement.offsetWidth);
  }

  /*
   STATIC CLASSES
   */
  static create(nav, opts = {}) {
    const name = opts.animation || 'ios';

    let TransitionClass = TransitionRegistry[name];
    if (!TransitionClass) {
      // transition wasn't found, default to a 'none' transition
      // which doesn't animate anything, just shows and hides
      TransitionClass = Transition;
    }

    return new TransitionClass(nav, opts);
  }

  static register(name, TransitionClass) {
    TransitionRegistry[name] = TransitionClass;
  }

}

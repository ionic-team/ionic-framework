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
    let enteringItem = this.entering = nav.getStagedEnteringItem();
    let leavingItem = this.leaving = nav.getStagedLeavingItem();

    // create animation for the entering item's "ion-view" element
    this.enteringView = new Animation(enteringItem.viewElementRef());
    this.enteringView.before.addClass(SHOW_VIEW_CSS);

    this.enteringView.onPlay(() => {
      enteringItem.postRender();
    });

    this.add(this.enteringView);

    if (opts.navbar !== false) {

      let enteringNavbar = this.enteringNavbar = new Animation(enteringItem.navbarRef());
      enteringNavbar.before.addClass(SHOW_NAVBAR_CSS);

      if (enteringItem.enableBack()) {
        // only animate in the back button if the entering view has it enabled
        let enteringBackButton = this.enteringBackButton = new Animation(enteringItem.backBtnRef());
        enteringBackButton
          .before.addClass(SHOW_BACK_BUTTON)
          .fadeIn();
        enteringNavbar.add(enteringBackButton);
      }

      this.enteringTitle = new Animation(enteringItem.titleRef());
      enteringNavbar.add(this.enteringTitle);
      this.add(enteringNavbar);

      this.enteringNavbarItems = new Animation(enteringItem.navbarItemRefs());
      this.enteringNavbarItems.fadeIn();
      enteringNavbar.add(this.enteringNavbarItems);
    }


    if (leavingItem) {
      // setup the leaving item if one exists (initial viewing wouldn't have a leaving item)
      this.leavingView = new Animation(leavingItem.viewElementRef());
      this.leavingView.after.removeClass(SHOW_VIEW_CSS);

      let leavingNavbar = this.leavingNavbar = new Animation(leavingItem.navbarRef());
      leavingNavbar.after.removeClass(SHOW_NAVBAR_CSS);

      let leavingBackButton = this.leavingBackButton = new Animation(leavingItem.backBtnRef());
      leavingBackButton
        .after.removeClass(SHOW_BACK_BUTTON)
        .fadeOut();
      leavingNavbar.add(leavingBackButton);

      this.leavingTitle = new Animation(leavingItem.titleRef());
      leavingNavbar.add(this.leavingTitle);

      this.leavingNavbarItems = new Animation(leavingItem.navbarItemRefs());
      this.leavingNavbarItems.fadeOut();
      leavingNavbar.add(this.leavingNavbarItems);

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

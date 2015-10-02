import {Animation} from '../animations/animation';
import {IonicConfig} from  '../config/config';

const SHOW_NAVBAR_CSS = 'show-navbar';
const SHOW_VIEW_CSS = 'show-view';
const SHOW_BACK_BUTTON = 'show-back-button';

let TransitionRegistry = {};


export class Transition extends Animation {

  constructor(nav, opts) {
    super(null, opts);

    // get the entering and leaving items
    let entering = this.entering = nav.getStagedEnteringView();
    let leaving = this.leaving = nav.getStagedLeavingView();


    // create animation for the entering view's content area
    this.enteringContent = new Animation(entering.viewElementRef());
    this.enteringContent.before.addClass(SHOW_VIEW_CSS);
    this.add(this.enteringContent);

    if (opts.navbar !== false) {

      let enteringNavbar = this.enteringNavbar = new Animation(entering.navbarRef());
      enteringNavbar.before.addClass(SHOW_NAVBAR_CSS);

      if (entering.enableBack()) {
        // only animate in the back button if the entering view has it enabled
        let enteringBackButton = this.enteringBackButton = new Animation(entering.backBtnRef());
        enteringBackButton
          .before.addClass(SHOW_BACK_BUTTON)
          .fadeIn();
        enteringNavbar.add(enteringBackButton);
      }

      this.enteringTitle = new Animation(entering.titleRef());
      enteringNavbar.add(this.enteringTitle);
      this.add(enteringNavbar);

      this.enteringNavbarItems = new Animation(entering.navbarItemRefs());
      enteringNavbar.add(this.enteringNavbarItems.fadeIn());

      this.enteringNavbarBg = new Animation(entering.navbarBgRef());
      enteringNavbar.add(this.enteringNavbarBg);
    }


    if (leaving) {
      // setup the leaving item if one exists (initial viewing wouldn't have a leaving item)
      this.leavingContent = new Animation(leaving.viewElementRef());
      this.leavingContent.after.removeClass(SHOW_VIEW_CSS);

      let leavingNavbar = this.leavingNavbar = new Animation(leaving.navbarRef());
      leavingNavbar.after.removeClass(SHOW_NAVBAR_CSS);

      let leavingBackButton = this.leavingBackButton = new Animation(leaving.backBtnRef());
      leavingBackButton
        .after.removeClass(SHOW_BACK_BUTTON)
        .fadeOut();
      leavingNavbar.add(leavingBackButton);

      this.leavingTitle = new Animation(leaving.titleRef());
      leavingNavbar.add(this.leavingTitle);

      this.leavingNavbarItems = new Animation(leaving.navbarItemRefs());
      leavingNavbar.add(this.leavingNavbarItems.fadeOut());

      this.leavingNavbarBg = new Animation(leaving.navbarBgRef());
      leavingNavbar.add(this.leavingNavbarBg);

      this.add(this.leavingContent, leavingNavbar);
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

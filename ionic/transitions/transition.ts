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

    this.enteringZ = entering.index;
    this.leavingZ = (leaving && leaving.index) || 0;

    // create animation for the entering view's content area
    this.enteringContent = new Animation(entering.viewElementRef());
    this.enteringContent.before.addClass(SHOW_VIEW_CSS);
    this.add(this.enteringContent);

    let enteringNavbar = this.enteringNavbar = new Animation(entering.navbarRef());
    this.enteringBackButton = new Animation(entering.backBtnRef());
    this.enteringTitle = new Animation(entering.titleRef());
    this.enteringNavbarItems = new Animation(entering.navbarItemRefs());
    this.enteringNavbarBg = new Animation(entering.navbarBgRef());

    if (opts.navbar !== false) {

      enteringNavbar.before.addClass(SHOW_NAVBAR_CSS);

      if (entering.enableBack()) {
        // only animate in the back button if the entering view has it enabled
        this.enteringBackButton
          .before.addClass(SHOW_BACK_BUTTON)
          .fadeIn();
        enteringNavbar.add(this.enteringBackButton);
      }

      enteringNavbar
        .add(this.enteringTitle)
        .add(this.enteringNavbarItems.fadeIn())
        .add(this.enteringNavbarBg);

      this.add(enteringNavbar);
    }

    this.leavingContent = new Animation(leaving && leaving.viewElementRef());
    let leavingNavbar = this.leavingNavbar = new Animation(leaving && leaving.navbarRef());
    this.leavingBackButton = new Animation(leaving && leaving.backBtnRef());
    this.leavingTitle = new Animation(leaving && leaving.titleRef());
    this.leavingNavbarItems = new Animation(leaving && leaving.navbarItemRefs());
    this.leavingNavbarBg = new Animation(leaving && leaving.navbarBgRef());

    if (leaving) {
      // setup the leaving item if one exists (initial viewing wouldn't have a leaving item)
      this.leavingContent.after.removeClass(SHOW_VIEW_CSS);

      leavingNavbar.after.removeClass(SHOW_NAVBAR_CSS);

      this.leavingBackButton
        .after.removeClass(SHOW_BACK_BUTTON)
        .fadeOut();

      leavingNavbar
        .add(this.leavingBackButton)
        .add(this.leavingTitle)
        .add(this.leavingNavbarItems.fadeOut())
        .add(this.leavingNavbarBg);

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

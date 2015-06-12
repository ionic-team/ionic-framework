import {Animation} from '../animations/animation';

const SHOW_NAVBAR_CSS = 'show-navbar';
const SHOW_VIEW_CSS = 'show-view';
const SHOW_BACK_BUTTON = 'show-back-button';

let TransitionRegistry = {};


export class Transition extends Animation {

  constructor(nav, opts) {
    super();

    const self = this;

    // get the entering and leaving items
    let enteringItem = self.entering = nav.getStagedEnteringItem();
    let leavingItem = self.leaving = nav.getStagedLeavingItem();

    // create animation for the entering item's "ion-view" element
    self.enteringView = new Animation(enteringItem.viewElement());
    self.enteringView.before.addClass(SHOW_VIEW_CSS);
    self.add(self.enteringView);

    if (opts.navbar !== false) {
      let enteringNavbar = self.enteringNavbar = new Animation(enteringItem.navbarElement());
      enteringNavbar.before.addClass(SHOW_NAVBAR_CSS);

      if (enteringItem.enableBack) {
        // only animate in the back button if the entering view has it enabled
        let enteringBackButton = self.enteringBackButton = new Animation(enteringItem.backButtonElement());
        enteringBackButton
          .before.addClass(SHOW_BACK_BUTTON)
          .fromTo('opacity', 0.02, 1)
        enteringNavbar.add(enteringBackButton);
      }

      self.enteringTitle = new Animation(enteringItem.titleElement());
      enteringNavbar.add(self.enteringTitle);
      self.add(enteringNavbar);

      self.enteringNavbarItems = new Animation(enteringItem.navbarItemElements())
      self.enteringNavbarItems.fromTo('opacity', 0.02, 1)
      enteringNavbar.add(self.enteringNavbarItems);
    }

    if (leavingItem) {
      self.leavingView = new Animation(leavingItem.viewElement());
      self.leavingView.after.removeClass(SHOW_VIEW_CSS);

      let leavingNavbar = self.leavingNavbar = new Animation(leavingItem.navbarElement());
      leavingNavbar.after.removeClass(SHOW_NAVBAR_CSS);

      let leavingBackButton = self.leavingBackButton = new Animation(leavingItem.backButtonElement());
      leavingBackButton
        .after.removeClass(SHOW_BACK_BUTTON)
        .fadeOut();
      leavingNavbar.add(leavingBackButton);

      self.leavingTitle = new Animation(leavingItem.titleElement());
      leavingNavbar.add(self.leavingTitle);

      self.leavingNavbarItems = new Animation(leavingItem.navbarItemElements())
      self.leavingNavbarItems.fadeOut();
      leavingNavbar.add(self.leavingNavbarItems);

      self.add(self.leavingView, leavingNavbar);
    }

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

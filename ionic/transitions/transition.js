import {Animation} from '../animations/animation';
import {rafPromise} from '../util/dom';

const SHOW_NAVBAR_CSS = 'show-navbar';
const SHOW_VIEW_CSS = 'show-view';


let registry = {};

export class Transition extends Animation {

  constructor(navCtrl) {
    super();

    // get the entering and leaving items
    let enteringItem = this.entering = navCtrl.getStagedEnteringItem();
    let leavingItem = this.leaving = navCtrl.getStagedLeavingItem();

    // create animation for the entering item's "ion-view" element
    this.enteringView = new Animation(enteringItem.viewElement());
    this.enteringView.beforePlay.addClass(SHOW_VIEW_CSS);

    // create animation for the entering item's "ion-navbar" element
    this.enteringNavbar = new Animation(enteringItem.navbarElement());
    this.enteringNavbar.beforePlay.addClass(SHOW_NAVBAR_CSS);

    // create animation for the entering item's "ion-content" element
    this.enteringContent = new Animation(enteringItem.contentElement());

    // create animation for the entering item's "ion-title" element
    this.enteringTitle = new Animation(enteringItem.titleElement());

    this.addAnimation(this.enteringView, this.enteringNavbar, this.enteringContent, this.enteringTitle);

    if (leavingItem) {
      // create animation for the entering item's "ion-view" element
      this.leavingView = new Animation(leavingItem.viewElement());
      this.leavingView.afterFinish.removeClass(SHOW_VIEW_CSS);

      // create animation for the entering item's "ion-navbar" element
      this.leavingNavbar = new Animation(leavingItem.navbarElement());
      this.leavingNavbar.afterFinish.removeClass(SHOW_NAVBAR_CSS);

      // create animation for the leaving item's "ion-content" element
      this.leavingContent = new Animation(leavingItem.contentElement());

      // create animation for the leaving item's "ion-title" element
      this.leavingTitle = new Animation(leavingItem.titleElement());

      this.addAnimation(this.leavingView, this.leavingNavbar, this.leavingContent, this.leavingTitle);
    }

  }

  stage() {
    return rafPromise();
  }


  /*
   STATIC CLASSES
   */
  static create(navCtrl, opts = {}) {
    let name = opts.animation || 'ios';

    let TransitionClass = registry[name];
    if (!TransitionClass) {
      // transition wasn't found, default to a 'none' transition
      // which doesn't animate anything, just shows and hides
      TransitionClass = Transition;
    }

    return new TransitionClass(navCtrl, opts);
  }

  static register(name, TransitionClass) {
    registry[name] = TransitionClass;
  }

}

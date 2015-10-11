import {Animation} from '../animations/animation';
import {IonicConfig} from  '../config/config';

const SHOW_NAVBAR_CSS = 'show-navbar';
const SHOW_VIEW_CSS = 'show-view';
const SHOW_BACK_BUTTON = 'show-back-button';


export class Transition extends Animation {

  constructor(navCtrl, opts, EnteringTransition, LeavingTransition) {
    super(null, opts);

    let enteringView = navCtrl.getStagedEnteringView();
    if (enteringView) {
      this.add( new EnteringTransition(navCtrl, enteringView, opts) );
    }

    let leavingView = navCtrl.getStagedLeavingView();
    if (leavingView) {
      this.add( new LeavingTransition(navCtrl, leavingView, opts) );
    }
  }

  /*
   STATIC CLASSES
   */
  static create(navCtrl, opts = {}) {
    const name = opts.animation || 'ios';

    let TransitionClass = transitionRegistry[name];
    if (!TransitionClass) {
      TransitionClass = transitionRegistry.ios;
    }

    return new TransitionClass(navCtrl, opts);
  }

  static register(name, TransitionClass) {
    transitionRegistry[name] = TransitionClass;
  }

}


export class ViewTransition extends Animation {

  constructor(navCtrl, viewCtrl, opts) {
    super(null, opts);

    // create animation for the entering view's content area
    this.content = new Animation(viewCtrl.contentRef());
    this.content.before.addClass(SHOW_VIEW_CSS);
    this.add(this.content);

    this.navbar = new Animation(viewCtrl.navbarRef());
    this.backButton = new Animation(viewCtrl.backBtnRef());
    this.title = new Animation(viewCtrl.titleRef());
    this.navbarItems = new Animation(viewCtrl.navbarItemRefs());
    this.navbarBg = new Animation(viewCtrl.navbarBgRef());

    this.navbar
      .add(this.backButton)
      .add(this.title)
      .add(this.navbarItems)
      .add(this.navbarBg);

    this.add(this.navbar);
  }

}

let transitionRegistry = {};

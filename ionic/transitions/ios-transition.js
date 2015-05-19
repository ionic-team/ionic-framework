import {Animation} from '../animations/animation';
import {rafPromise} from '../util/dom'
import {Transition} from './transition'


const EASING_FN = [.36, .66, .04, 1];
const DURATION = 500;

const OPACITY = 'opacity';
const TRANSFORM = 'transform';

const CENTER = 'none';
const OFF_RIGHT = 'translate3d(100%,0px,0px)';
const OFF_LEFT = 'translate3d(-33%,0px,0px)';
const OFF_OPACITY = 0.8;

const SHOW_TOOLBAR_CSS = 'show-toolbar';
const SHOW_NAV_ITEM_CSS = 'show-nav-item';


class IOSTransition extends Animation {

  constructor(navCtrl, opts) {
    super();

    // global duration and easing for all child animations
    this.duration(DURATION);

    // get the entering and leaving items
    this.enteringItem = navCtrl.getStagedEnteringItem();
    this.leavingItem = navCtrl.getStagedLeavingItem();

    // create animation for the entering content
    let enteringContent = new Animation(this.enteringItem.getContent());

    // create animation for the entering toolbars
    let enteringToolbars = new Animation(this.enteringItem.getToolbars());

    // create animation for the entering title element
    let enteringTitle = new Animation(this.enteringItem.getTitle());

    // create animation for the leaving content
    // leavingItem could be null, but the animation instance knows to do nothing
    let leavingContent = new Animation(this.leavingItem && this.leavingItem.getContent());

    // create animation for the leaving content
    // leavingItem could be null, but the animation instance knows to do nothing
    let leavingToolbars = new Animation(this.leavingItem && this.leavingItem.getToolbars());

    // create animation for the entering title element
    let leavingTitle = new Animation(this.leavingItem && this.leavingItem.getTitle());

    // entering item moves to center
    // before starting, set enteringItem to display: block
    enteringContent
      .beforePlay.addClass(SHOW_NAV_ITEM_CSS)
      .to(TRANSFORM, CENTER)
      .to(OPACITY, 1);

    enteringTitle
      .to(TRANSFORM, CENTER)
      .to(OPACITY, 1);

    enteringToolbars
      .beforePlay.addClass(SHOW_TOOLBAR_CSS);

    // leaving view moves off screen
    // when completed, set leavingItem to display: none
    leavingContent
      .afterFinish.removeClass(SHOW_NAV_ITEM_CSS)
      .from(TRANSFORM, CENTER)
      .from(OPACITY, 1);

    leavingToolbars
      .afterFinish.removeClass(SHOW_TOOLBAR_CSS);

    leavingTitle
      .from(TRANSFORM, CENTER)
      .from(OPACITY, 1);

    // set properties depending on direction
    if (opts.direction === 'back') {
      // back direction
      enteringContent
        .from(TRANSFORM, OFF_LEFT)
        .from(OPACITY, OFF_OPACITY)
        .to(OPACITY, 1);

      enteringTitle
        .from(TRANSFORM, OFF_LEFT)
        .from(OPACITY, 0)
        .to(OPACITY, 1);

      leavingContent
        .to(TRANSFORM, OFF_RIGHT)
        .to(OPACITY, 1);

      leavingTitle
        .to(TRANSFORM, OFF_RIGHT)
        .to(OPACITY, 1);

    } else {
      // forward direction
      enteringContent
        .from(TRANSFORM, OFF_RIGHT)
        .from(OPACITY, 1);

      enteringTitle
        .from(TRANSFORM, OFF_RIGHT);

      leavingContent
        .to(TRANSFORM, OFF_LEFT)
        .to(OPACITY, OFF_OPACITY);

      leavingTitle
        .to(TRANSFORM, OFF_LEFT)
        .to(OPACITY, 0);
    }

    // set child animations
    this.children(enteringContent, enteringToolbars, enteringTitle, leavingContent, leavingToolbars, leavingTitle);

  }

  stage() {
    return rafPromise();
  }

}

Transition.register('ios', IOSTransition);

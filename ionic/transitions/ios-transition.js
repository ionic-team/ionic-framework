import {Animation} from '../animations/animation';
import {rafPromise} from '../util/dom'
import {Transition} from './transition'


const DURATION = 500;
const EASING = 'cubic-bezier(.36,.66,.04,1)';

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
    this.easing(EASING);

    // get the entering and leaving items
    let enteringItem = navCtrl.getStagedEnteringItem();
    let leavingItem = navCtrl.getStagedLeavingItem();

    // create animation for the entering content
    let enteringContent = new Animation(enteringItem.getContent());

    // create animation for the entering toolbars
    let enteringToolbars = new Animation(enteringItem.getToolbars());

    // create animation for the entering title element
    let enteringTitle = new Animation(enteringItem.getTitle());

    // create animation for the leaving content
    // leavingItem could be null, but the animation instance knows to do nothing
    let leavingContent = new Animation(leavingItem && leavingItem.getContent());

    // create animation for the leaving content
    // leavingItem could be null, but the animation instance knows to do nothing
    let leavingToolbars = new Animation(leavingItem && leavingItem.getToolbars());

    // create animation for the entering title element
    let leavingTitle = new Animation(leavingItem && leavingItem.getTitle());

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

    // if the back button should show, then fade it in
    if (enteringItem.enableBack) {
      let enteringBackButton = new Animation(enteringItem.getBackButton())
      enteringBackButton.from(OPACITY, 0).to(OPACITY, 1);
      this.addChild(enteringBackButton);
    }

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

    if (leavingItem && leavingItem.enableBack) {
      let leavingBackButton = new Animation(leavingItem.getBackButton())
      leavingBackButton.from(OPACITY, 1).to(OPACITY, 0);
      this.addChild(leavingBackButton);
    }

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

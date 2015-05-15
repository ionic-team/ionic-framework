import {Animation} from '../collide/animation';
import {addEasing} from '../collide/easing';
import {rafPromise} from '../util/dom'
import {Transition} from './transition'


const EASING_FN = [.36, .66, .04, 1];
const DURATION = 500;
const OFF_RIGHT = '100%';
const OFF_LEFT = '-33%';
const OFF_OPACITY = 0.8;

const TRANSLATE_X = 'translateX';
const OPACITY = 'opacity';


class IOSTransition extends Animation {

  constructor(navCtrl, opts) {
    super();

    // global duration and easing for all child animations
    this.duration(DURATION);
    this.easing('ios');

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
      .addStartClass('show-nav-item')
      .to(TRANSLATE_X, 0)
      .to(OPACITY, 1);

    enteringTitle
      .to(TRANSLATE_X, 0)
      .to(OPACITY, 1);

    enteringToolbars
      .addStartClass('show-toolbar');

    // leaving view moves off screen
    // when completed, set leavingItem to display: none
    leavingContent
      .removeEndClass('show-nav-item')
      .from(TRANSLATE_X, 0)
      .from(OPACITY, 1);

    leavingToolbars
      .removeEndClass('show-toolbar');

    leavingTitle
      .from(TRANSLATE_X, 0)
      .from(OPACITY, 1);

    // set properties depending on direction
    if (opts.direction === 'back') {
      // back direction
      enteringContent
        .from(TRANSLATE_X, OFF_LEFT)
        .from(OPACITY, OFF_OPACITY)
        .to(OPACITY, 1);

      enteringTitle
        .from(TRANSLATE_X, OFF_LEFT)
        .from(OPACITY, 0)
        .to(OPACITY, 1);

      leavingContent
        .to(TRANSLATE_X, OFF_RIGHT)
        .to(OPACITY, 1);

      leavingTitle
        .to(TRANSLATE_X, OFF_RIGHT)
        .to(OPACITY, 1);

    } else {
      // forward direction
      enteringContent
        .from(TRANSLATE_X, OFF_RIGHT)
        .from(OPACITY, 1);

      enteringTitle
        .from(TRANSLATE_X, OFF_RIGHT);

      leavingContent
        .to(TRANSLATE_X, OFF_LEFT)
        .to(OPACITY, OFF_OPACITY);

      leavingTitle
        .to(TRANSLATE_X, OFF_LEFT)
        .to(OPACITY, 0);
    }

    // set child animations
    this.setChildren([enteringContent, enteringToolbars, enteringTitle, leavingContent, leavingToolbars, leavingTitle]);
  }

  stage() {
    return rafPromise();
  }

}

addEasing('ios', EASING_FN);

Transition.register('ios', IOSTransition);

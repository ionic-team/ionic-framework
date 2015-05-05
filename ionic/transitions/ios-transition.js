import {Animation} from '../collide/animation';
import {addEasing} from '../collide/easing';
import {rafPromise} from '../util/dom'
import {Transition} from './transition'


const EASING_FN = [.36, .66, .04, 1];
const DURATION = 500;


class IOSTransition extends Animation {

  constructor(navCtrl, opts) {
    super();

    this.duration(DURATION);
    this.easing('ios');

    // get the entering and leaving items
    this.enteringItem = navCtrl.getStagedEnteringItem();
    this.leavingItem = navCtrl.getStagedLeavingItem();

    // create animation for entering item
    let enteringItemAnimation = new Animation();
    enteringItemAnimation.elements(this.enteringItem.navItem.domElement);

    // show the item
    this.enteringItem.navItem.domElement.style.display = 'block';

    if (opts.direction === 'back') {
      // back direction
      this.enteringItem.navItem.domElement.style.transform = 'translateX(-33%)';
      if (this.leavingItem) {
        this.leavingItem.navItem.domElement.style.display = '';
      }

    } else {
      // forward direction
      this.enteringItem.navItem.domElement.style.transform = 'translateX(100%)';

    }

    // entering item moves to dead center
    enteringItemAnimation.to('translateX', ['0%', '100%']);

    this.addChild(enteringItemAnimation);
  }

  stage() {
    return rafPromise();
  }

}

addEasing('ios', EASING_FN);

Transition.register('ios', IOSTransition);

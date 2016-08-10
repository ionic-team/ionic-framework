import { Animation, AnimationOptions } from '../animations/animation';
import { isPresent } from '../util/util';
import { Content } from '../components/content/content';
import { Tabs } from '../components/tabs/tabs';
import { ViewController } from '../navigation/view-controller';


/**
 * @private
 *
 * - play
 * - Add before classes - DOM WRITE
 * - Remove before classes - DOM WRITE
 * - Add before inline styles - DOM WRITE
 * - set inline FROM styles - DOM WRITE
 * - RAF
 * - read toolbar dimensions - DOM READ
 * - write content top/bottom padding - DOM WRITE
 * - set css transition duration/easing - DOM WRITE
 * - RAF
 * - set inline TO styles - DOM WRITE
 */
export class Transition extends Animation {
  enteringView: ViewController;
  leavingView: ViewController;

  init(enteringView: ViewController, leavingView: ViewController, opts: AnimationOptions) {
    this.enteringView = enteringView;
    this.leavingView = leavingView;
    this.opts = opts;
  }

  destroy() {
    super.destroy();
    this.enteringView = this.leavingView = null;
  }

  static createTransition(transitionName: string): Transition {
    let TransitionClass: any = TransitionRegistry[transitionName];
    if (!TransitionClass) {
      // didn't find a transition animation, default to ios-transition
      TransitionClass = TransitionRegistry['ios-transition'];
    }

    return new TransitionClass();
  }

  static register(name: string, TransitionClass: any) {
    TransitionRegistry[name] = TransitionClass;
  }

}

let TransitionRegistry: {[key: string]: Transition} = {};

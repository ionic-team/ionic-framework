import { Animation } from '../animations/animation';
import { closest } from '../util/dom';
import { Content } from '../components/content/content';
import { Tabs } from '../components/tabs/tabs';
import { ViewController } from '../components/nav/view-controller';


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

  constructor(public enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(null, {
      renderDelay: opts.renderDelay
    });
  }

  static createTransition(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions): Transition {
    let TransitionClass = TransitionRegistry[opts.animation];
    if (!TransitionClass) {
      // didn't find a transition animation, default to ios-transition
      TransitionClass = TransitionRegistry['ios-transition'];
    }

    return new TransitionClass(enteringView, leavingView, opts);
  }

  static register(name: string, TransitionClass: any) {
    TransitionRegistry[name] = TransitionClass;
  }

}

export interface TransitionOptions {
  animation: string;
  duration: number;
  easing: string;
  direction: string;
  renderDelay?: number;
  isRTL?: boolean;
  ev?: any;
}

let TransitionRegistry: any = {};

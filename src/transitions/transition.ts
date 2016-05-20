import {Animation} from '../animations/animation';
import {ViewController} from '../components/nav/view-controller';


/**
 * @private
 **/
export class Transition extends Animation {

  constructor(opts: TransitionOptions) {
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

  static register(name: string, TransitionClass) {
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
}

let TransitionRegistry = {};

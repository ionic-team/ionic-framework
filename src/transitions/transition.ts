import { Animation, AnimationOptions } from '../animations/animation';
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
  _trnsStart: Function;

  parent: Transition;
  hasChildTrns: boolean;
  trnsId: number;


  constructor(public enteringView: ViewController, public leavingView: ViewController, opts: AnimationOptions, raf?: Function) {
    super(null, opts, raf);
  }

  init() {}

  registerStart(trnsStart: Function) {
    this._trnsStart = trnsStart;
  }

  start() {
    this._trnsStart && this._trnsStart();
    this._trnsStart = null;
  }

  destroy() {
    super.destroy();
    this.enteringView = this.leavingView = this._trnsStart = null;
  }

  static createTransition(transitionName: string, enteringView: ViewController, leavingView: ViewController, opts: AnimationOptions): Transition {
    let TransitionClass: any = TransitionRegistry[transitionName];
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

let TransitionRegistry: {[key: string]: Transition} = {};

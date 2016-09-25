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

}

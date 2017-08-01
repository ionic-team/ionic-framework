import { Animation, AnimationOptions } from '../animations/animation';
import { Platform } from '../platform/platform';
import { ViewController } from '../navigation/view-controller';


/**
 * @hidden
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
  trnsId: number;

  constructor(
    plt: Platform,
    public enteringView: ViewController,
    public leavingView: ViewController,
    opts: AnimationOptions
    ) {
    super(plt, null, opts);
  }

  init() {}

  registerStart(trnsStart: Function) {
    this._trnsStart = trnsStart;
  }

  start() {
    this._trnsStart && this._trnsStart();
    this._trnsStart = null;

    // bubble up start
    this.parent && this.parent.start();
  }

  destroy() {
    super.destroy();
    this.parent = this.enteringView = this.leavingView = this._trnsStart = null;
  }

}

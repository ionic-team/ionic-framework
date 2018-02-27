import { ViewController } from './view-controller';
import { Animation, AnimationBuilder } from '../..';

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
export class Transition {
  _trnsStart: Function;

  trnsId: number;
  ani: Animation;
  parent: Transition;

  constructor(
    private animationCtrl: HTMLIonAnimationControllerElement,
    private builder: AnimationBuilder,
    public enteringView: ViewController,
    public leavingView: ViewController,
    private opts: any
  ) {}

  registerStart(trnsStart: Function) {
    this._trnsStart = trnsStart;
  }

  init() {
    return this.animationCtrl.create(this.builder, null, this.opts).then((ani) => {
      this.ani = ani;
    });
  }

  start() {
    this._trnsStart && this._trnsStart();
    this._trnsStart = null;

    // bubble up start
    this.parent && this.parent.start();
  }

  destroy() {
    this.ani && this.ani.destroy();
    this.ani = this._trnsStart = null;
  }

}

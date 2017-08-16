import { Animation } from '../../animations/animation';
import { AnimationOptions } from '../../animations/interfaces';

import { ViewController } from '../view-controller';

export class Transition extends Animation {

  private transitionStart: Function;
  parent: Transition;
  transitionId: number;

  constructor(public enteringView: ViewController, public leavingView: ViewController, public opts: AnimationOptions) {
    super();
  }

  init() {
  }

  registerStart(transitionStart: Function) {
    this.transitionStart = transitionStart;
  }

  start() {
    this.transitionStart && this.transitionStart();
    this.transitionStart = null;

    // bubble up start
    this.parent && this.parent.start();
  }

  destroy() {
    super.destroy();
    this.parent = this.transitionStart = null;
  }
}

import { Injectable } from '@angular/core';

import { AnimationOptions } from '../animations/animation';
import { Config } from '../config/config';
import { createTransition } from './transition-registry';
import { isPresent } from '../util/util';
import { NavControllerBase } from '../navigation/nav-controller-base';
import { Platform } from '../platform/platform';
import { Transition } from './transition';
import { ViewController } from '../navigation/view-controller';


/**
 * @private
 */
@Injectable()
export class TransitionController {
  private _ids = 0;
  private _trns: {[key: number]: Transition} = {};

  constructor(public plt: Platform, private _config: Config) {}

  getRootTrnsId(nav: NavControllerBase): number {
    let parent = <NavControllerBase>nav.parent;
    while (parent) {
      if (isPresent(parent._trnsId)) {
        return parent._trnsId;
      }
      parent = parent.parent;
    }
    return null;
  }

  nextId() {
    return this._ids++;
  }

  get(trnsId: number, enteringView: ViewController, leavingView: ViewController, opts: AnimationOptions): Transition {
    const trns = createTransition(this.plt, this._config, opts.animation, enteringView, leavingView, opts);
    trns.trnsId = trnsId;

    if (!this._trns[trnsId]) {
      // we haven't created the root transition yet
      this._trns[trnsId] = trns;

    } else {
      // we already have a root transition created
      // add this new transition as a child to the root
      this._trns[trnsId].add(trns);
    }

    return trns;
  }

  destroy(trnsId: number) {
    const trans = this._trns[trnsId];
    if (trans) {
      trans.destroy();
      delete this._trns[trnsId];
    }
  }

}

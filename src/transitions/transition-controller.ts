import { AnimationOptions } from '../animations/animation';
import { isPresent } from '../util/util';
import { NavControllerBase } from '../navigation/nav-controller-base';
import { Transition } from './transition';
import { ViewController } from '../navigation/view-controller';

/**
 * @private
 */
export class TransitionController {
  private _ids = 0;
  private _trans: {[key: number]: Transition} = {};

  getRootTransId(nav: NavControllerBase): number {
    let parent = <NavControllerBase>nav.parent;
    while (parent) {
      if (isPresent(parent._transId)) {
        return parent._transId;
      }
      parent = parent.parent;
    }
    return null;
  }

  nextId() {
    return this._ids++;
  }

  get(transId: number, enteringView: ViewController, leavingView: ViewController, opts: AnimationOptions) {
    const trans = Transition.createTransition(opts.animation, enteringView, leavingView, opts);
    trans.transId = transId;

    if (!this._trans[transId]) {
      // we haven't created the root transition yet
      this._trans[transId] = trans;

    } else {
      // we already have a root transition created
      // add this new transition as a child to the root
      this._trans[transId].add(trans);
    }

    return trans;
  }

  destroy(transId: number) {
    if (this._trans[transId]) {
      this._trans[transId].destroy();
      delete this._trans[transId];
    }
  }

}

import { isPresent } from './nav-util';
import { Transition } from './transition';
import { NavControllerBase } from './nav';

export class TransitionController {
  private _ids = 0;
  private _trns = new Map<number, Transition>();

  getRootTrnsId(nav: NavControllerBase): number {
    nav = nav.parent;
    while (nav) {
      if (isPresent(nav._trnsId)) {
        return nav._trnsId;
      }
      nav = nav.parent;
    }
    return null;
  }

  nextId() {
    return this._ids++;
  }

  register(trnsId: number, trns: Transition) {
    trns.trnsId = trnsId;

    const parent = this._trns.get(trnsId);
    if (!parent) {
      // we haven't created the root transition yet
      this._trns.set(trnsId, trns);

    } else {
      // we already have a root transition created
      // add this new transition as a child to the root
      parent.parent = trns;
    }
  }

  destroy(trnsId: number) {
    const trans = this._trns.get(trnsId);
    if (trans) {
      trans.destroy();
      this._trns.delete(trnsId);
    }
  }
}

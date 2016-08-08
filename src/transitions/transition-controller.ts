import { isPresent } from '../util/util';
import { NavControllerBase } from '../components/nav/nav-controller-base';
import { Transition } from './transition';

/**
 * @private
 */
export class TransitionController {

  private _trans: {[key: string]: Transition} = {};

  getRootTransId(nav: NavControllerBase): string {
    let parent = <NavControllerBase>nav.parent;
    while (parent) {
      if (isPresent(parent.rootTransId)) {
        return parent.rootTransId;
      }
      parent = parent.parent;
    }
    return null;
  }

  create(transitionName: string) {
    return Transition.createTransition(transitionName);
  }

  get(transId: string, transitionName: string) {
    const trans = this.create(transitionName);

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

  destroy(transId: string) {
    this._trans[transId] && this._trans[transId].destroy();
    delete this._trans[transId];
  }

  isMostRecent(transId: string): boolean {
    for (var registeredTransId in this._trans) {
      if (transId < registeredTransId) {
        return false;
      }
    }
    return true;
  }

  multipleActiveTrans(): boolean {
    return (Object.keys(this._trans).length > 1);
  }

}

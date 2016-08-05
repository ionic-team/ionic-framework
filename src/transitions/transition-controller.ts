import { isPresent } from '../util/util';
import { NavControllerBase } from '../components/nav/nav-controller-base';
import { Transition } from './transition';
import { ViewController } from '../components/nav/view-controller';


export class TransitionController {
  ids: number = -1;
  trans: {[key: string]: Transition} = {};

  getRootTransId(nav: NavControllerBase): number {
    let parent = <NavControllerBase>nav.parent;
    while (parent) {
      if (isPresent(parent.rootTransId)) {
        return parent.rootTransId;
      }
      parent = parent.parent;
    }
    return null;
  }

  nextId(): number {
    return this.ids++;
  }

  create(transitionName: string) {
    return Transition.createTransition(transitionName);
  }

  get(transId: number, transitionName: string) {
    const trans = this.create(transitionName);

    if (!this.trans[transId]) {
      // we haven't created the root transition yet
      this.trans[transId] = trans;

    } else {
      // we already have a root transition created
      // add this new transition as a child to the root
      this.trans[transId].add(trans);
    }

    return trans;
  }

  destroy(transId: number) {
    this.trans[transId] && this.trans[transId].destroy();
    delete this.trans[transId];
  }

  isMostRecent(transId: number): boolean {
    return (transId === this.ids);
  }

}

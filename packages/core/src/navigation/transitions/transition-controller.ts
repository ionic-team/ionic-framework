import { NavController } from '../nav-controller';
import { ViewController } from '../view-controller';
import { AnimationOptions } from '../../animations/interfaces';

import { Transition } from './transition';
import { isDef } from '../../utils/helpers';

export function getRootTransitionId(nav: NavController): number {
  nav = nav.getParent();
  while (nav) {
    const transitionId = nav.transitionId;
    if (isDef(transitionId)) {
      return transitionId;
    }
    nav = nav.getParent();
  }
  return -1;
}

export function nextId() {
  return transitionIds++;
}

export function destroy(transitionId: number) {
  const transition = transitions.get(transitionId);
  if (transition) {
    transition.destroy();
    transitions.delete(transitionId);
  }
}

export function getTransition(transitionId: number, viewController: ViewController, opts: AnimationOptions): Transition {
  const TransitionConstructor: any = Ionic.config.get(opts.animation) || Ionic.config.get('ios-transition');

  const transition = new TransitionConstructor(viewController.element) as Transition;
  transition.transitionId = transitionId;

  const rootTransition = transitions.get(transitionId);
  if (rootTransition) {
    rootTransition.add(transition);
  } else {
    transitions.set(transitionId, transition);
  }

  return transition;
}

let transitionIds = 0;
let transitions = new Map<number, any>();
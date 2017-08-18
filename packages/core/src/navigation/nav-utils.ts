import { Nav, Transition, ViewController } from './nav-interfaces';
import { Animation, AnimationOptions, Config, TransitionBuilder } from '..';
import { isDef } from '../utils/helpers'

export const STATE_NEW = 1;
export const STATE_INITIALIZED = 2;
export const STATE_ATTACHED = 3;
export const STATE_DESTROYED = 4;

export const INIT_ZINDEX = 100;
export const PORTAL_Z_INDEX_OFFSET = 0;

export const DIRECTION_BACK = 'back';
export const DIRECTION_FORWARD = 'forward';
export const DIRECTION_SWITCH = 'switch';

export const NAV = 'nav';
export const TABS = 'tabs';

let transitionIds = 0;
let activeTransitions = new Map<number, any>();

let portalZindex = 9999;

export function isViewController(object: any): boolean {
  return !!(object && object.didLoad && object.willUnload);
}

export function setZIndex(nav: Nav, enteringView: ViewController, leavingView: ViewController, direction: string) {
  if (enteringView) {
    if (nav.isPortal) {
      if (direction === DIRECTION_FORWARD) {
        updateZIndex(enteringView, nav.zIndexOffset + portalZindex);
      }
      portalZindex++;
      return;
    }

    leavingView = leavingView || nav.getPrevious(enteringView);

    if (leavingView && isDef(leavingView.zIndex)) {
      if (direction === DIRECTION_BACK) {
        updateZIndex(enteringView, leavingView.zIndex - 1);

      } else {
        updateZIndex(enteringView, leavingView.zIndex + 1);
      }

    } else {
      updateZIndex(enteringView, INIT_ZINDEX + nav.zIndexOffset);
    }
  }
}

export function updateZIndex(viewController: ViewController, newZIndex: number) {
  if (newZIndex !== viewController.zIndex) {
    viewController.zIndex = newZIndex;
    viewController.element.style.zIndex = '' + newZIndex;
  }
}

export function toggleHidden(element: HTMLElement, isVisible: Boolean, shouldBeVisible: boolean) {
  if (isVisible !== shouldBeVisible) {
    element.hidden = shouldBeVisible;
  }
}

export function canNavGoBack(nav: Nav) {
  if (!nav) {
    return false;
  }
  return !!nav.getPrevious();
}

export function transitionFactory(animation: Animation): Transition {
  (animation as any).registerTransitionStart = (callback: Function) => {
    (animation as any).transitionStartFunction = callback;
  }

  (animation as any).start = function() {
    this.transitionStartFunction && this.transitionStartFunction();
    this.transitionStartFunction = null;
    transitionStartImpl(animation as Transition);
  };

  (animation as any).originalDestroy = animation.destroy;

  (animation as any).destroy = function() {
    transitionDestroyImpl(animation as Transition);
  };

  return animation as Transition;
}

export function transitionStartImpl(transition: Transition) {
  transition.transitionStartFunction && transition.transitionStartFunction();
  transition.transitionStartFunction = null;
  transition.parent && (transition.parent as Transition).start();
}

export function transitionDestroyImpl(transition: Transition) {
  transition.originalDestroy();
  transition.parent = transition.enteringView = transition.leavingView = transition.transitionStartFunction = null;
}

export function getParentTransitionId(nav: Nav) {
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

export function getNextTransitionId() {
  return transitionIds++;
}

export function destroy(transitionId: number) {
  const transition = activeTransitions.get(transitionId);
  if (transition) {
    transition.destroy();
    activeTransitions.delete(transitionId);
  }
}

export function getHydratedTransition(name: string, config: Config, transitionId: number, emptyTransition: Transition, enteringView: ViewController, leavingView: ViewController, opts: AnimationOptions, defaultTransitionFactory: TransitionBuilder) {

  const transitionFactory = config.get(name) as TransitionBuilder || defaultTransitionFactory;
  const hydratedTransition = transitionFactory(emptyTransition, enteringView, leavingView, opts);
  hydratedTransition.transitionId = transitionId;

  if (!activeTransitions.has(transitionId)) {
    // sweet, this is the root transition
    activeTransitions.set(transitionId, hydratedTransition);
  } else {
    // we've got a parent transition going
    // just append this transition to the existing one
    activeTransitions.get(transitionId).add(hydratedTransition);
  }

  return hydratedTransition;
}
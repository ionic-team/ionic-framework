import { FrameworkDelegate } from './framework-delegate';
import { NavController } from './nav-controller';
import { ViewController } from './view-controller';
import { Transition } from './transitions/transition';

export const STATE_NEW = 1;
export const STATE_INITIALIZED = 2;
export const STATE_ATTACHED = 3;
export const STATE_DESTROYED = 4;

export const INIT_ZINDEX = 100;

export const DIRECTION_BACK = 'back';
export const DIRECTION_FORWARD = 'forward';
export const DIRECTION_SWITCH = 'switch';

export const NAV = 'nav';
export const TABS = 'tabs';

export interface NavResult {
  hasCompleted: boolean;
  requiresTransition: boolean;
  enteringName?: string;
  leavingName?: string;
  direction?: string;
}

export interface NavControllerData {
  transitioning?: boolean;
  destroyed?: boolean;
  views?: ViewController[];
  childNavs?: NavController[];
  isPortal?: boolean;
  isViewInitialized?: boolean;
  transitionId?: number;
  swipeToGoBackTransition?: Transition;
}

export interface NavOptions {
  animate?: boolean;
  animation?: string;
  direction?: string;
  duration?: number;
  easing?: string;
  id?: string;
  keyboardClose?: boolean;
  progressAnimation?: boolean;
  disableApp?: boolean;
  event?: any;
  updateUrl?: boolean;
  isNavRoot?: boolean;
}

export interface TransitionInstruction {
  opts: NavOptions;
  insertStart?: number;
  insertViews?: any[];
  removeView?: any; // TODO make VC
  removeStart?: number;
  removeCount?: number;
  resolve?: (hasCompleted: boolean) => void;
  reject?: (rejectReason: Error) => void;
  done?: Function;
  leavingRequiresTransition?: boolean;
  enteringRequiresTransition?: boolean;
  requiresTransition?: boolean;
  id?: number;
  nav?: NavController;
  delegate?: FrameworkDelegate;
}

export interface NavResult {
  hasCompleted: boolean;
  requiresTransition: boolean;
  direction?: string;
}

export function isViewController(object: any): boolean {
  return !!(object && object.didLoad && object.willUnload);
}

export interface ComponentDataPair {
  page: any;
  params: any;
}

export function setZIndex(_isPortal: boolean, _enteringView: ViewController, _leavingView: ViewController, _direction: string) {
  // TODO
}

export function toggleHidden(element: HTMLElement, isVisible: Boolean, shouldBeVisible: boolean) {
  if (isVisible !== shouldBeVisible) {
    element.hidden = shouldBeVisible;
  }
}
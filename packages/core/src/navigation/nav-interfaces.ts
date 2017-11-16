import {
  Animation,
  AnimationOptions,
  Nav,
  ViewController
} from '../index';

export interface FrameworkDelegate {
  attachViewToDom(navController: Nav, enteringView: ViewController): Promise<any>;
  removeViewFromDom(navController: Nav, leavingView: ViewController): Promise<any>;
}

export interface NavContainer {
  id?: number;
  name?: string;
  parent?: Nav;
  getActiveChildNavs?(): NavContainer[];
  getAllChildNavs?(): NavContainer[];
  getType?(): string;
  getSecondaryIdentifier?(): string;
}

export interface NavResult {
  hasCompleted: boolean;
  requiresTransition: boolean;
  enteringName?: string;
  leavingName?: string;
  direction?: string;
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
  nav?: Nav;
  delegate?: FrameworkDelegate;
  animation?: Animation;
}

export interface NavResult {
  hasCompleted: boolean;
  requiresTransition: boolean;
  direction?: string;
}

export interface ComponentDataPair {
  page: any;
  params: any;
}

export interface Transition extends Animation {
  enteringView?: ViewController;
  leavingView?: ViewController;
  transitionStartFunction?: Function;
  transitionId?: number;
  registerTransitionStart(callback: Function): void;
  start(): void;
  originalDestroy(): void; // this is intended to be private, don't use this bad boy
}

export interface TransitionBuilder {
  (rootTransition: Transition, enteringView: ViewController, leavingView: ViewController, opts: AnimationOptions ): Transition;
}

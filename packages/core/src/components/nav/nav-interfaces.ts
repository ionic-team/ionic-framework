
/* it is very important to keep this interface in sync with ./nav */
import {
  Animation,
  AnimationOptions,
  FrameworkDelegate,
  Nav,
  NavOptions,
  PublicViewController,
  ViewController
} from '../../index';

export interface PublicNav {
  push(component: any, data?: any, opts?: NavOptions): Promise<any>;
  pop(opts?: NavOptions): Promise<any>;
  setRoot(component: any, data?: any, opts?: NavOptions): Promise<any>;
  insert(insertIndex: number, page: any, params?: any, opts?: NavOptions): Promise<any>;
  insertPages(insertIndex: number, insertPages: any[], opts?: NavOptions): Promise<any>;
  popToRoot(opts?: NavOptions): Promise<any>;
  popTo(indexOrViewCtrl: any, opts?: NavOptions): Promise<any>;
  removeIndex(startIndex: number, removeCount?: number, opts?: NavOptions): Promise<any>;
  removeView(viewController: PublicViewController, opts?: NavOptions): Promise<any>;
  setPages(componentDataPairs: any[], opts?: NavOptions): Promise<any>;

  getActive?(): PublicViewController;
  getPrevious?(view?: PublicViewController): PublicViewController;
  canGoBack?(): boolean;
  canSwipeBack?(): boolean;
  getFirstView?(): PublicViewController;

  element?: HTMLElement;
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

export interface PublicViewController {
  id?: string;
  component?: any;
  instance?: any;
  element?: HTMLElement;
}

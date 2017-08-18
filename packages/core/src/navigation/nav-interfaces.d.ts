import {
  Animation,
  AnimationController,
  AnimationOptions,
  Config
} from '..';

export interface FrameworkDelegate {
  attachViewToDom(navController: Nav, enteringView: ViewController): Promise<any>;
  removeViewFromDom(navController: Nav, leavingView: ViewController): Promise<any>;
  destroy(viewController: ViewController): Promise<any>;
}

export interface Nav {
  id: number;
  element: HTMLElement;
  views?: ViewController[];
  transitioning?: boolean;
  destroyed?: boolean;
  transitionId?: number;
  isViewInitialized?: boolean;
  isPortal?: boolean;
  zIndexOffset?: number;
  swipeToGoBackTransition?: any; // TODO Transition
  getParent(): Nav;
  getActive(): ViewController;
  getPrevious(view?: ViewController): ViewController;
  childNavs?: Nav[]; // TODO - make nav container
  animationCtrl?: AnimationController;
  config?: Config;
}

export interface ViewController {
  id: string;
  component: any;
  data: any;
  element: HTMLElement;
  instance: any;
  state: number;
  nav: Nav;
  frameworkDelegate: FrameworkDelegate;
  dismissProxy?: any;
  zIndex: number;

  // life cycle events
  willLeave(unload: boolean): void;
  didLeave(): void;
  willEnter(): void;
  didEnter(): void;
  willLoad(): void;
  didLoad(): void;
  willUnload():void;

  destroy(): Promise<any>;
  getTransitionName(direction: string): string;
  onDidDismiss: (data: any, role: string) => void;
  onWillDismiss: (data: any, role: string) => void;
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
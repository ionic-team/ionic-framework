export interface FrameworkDelegate {
  attachViewToDom(navController: NavController, enteringView: ViewController): Promise<any>;
  removeViewFromDom(navController: NavController, leavingView: ViewController): Promise<any>;
  destroy(viewController: ViewController): Promise<any>;
}

export interface NavController {
  id: number;
  element: HTMLElement;
  views?: ViewController[];
  transitioning?: boolean;
  destroyed?: boolean;
  transitionId?: number;
  isViewInitialized?: boolean;
  isPortal?: boolean;
  swipeToGoBackTransition?: any; // TODO Transition
  getParent(): NavController;
  childNavs?: NavController[]; // TODO - make nav container
}

export interface ViewController {
  id: string;
  component: any;
  data: any;
  element: HTMLElement;
  instance: any;
  state: number;
  nav: NavController;
  frameworkDelegate: FrameworkDelegate;
  dismissProxy?: any;

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
  nav?: NavController;
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

import { EventEmitter } from '@stencil/core';

import {
  Animation,
  AnimationController,
  AnimationOptions,
  Config
} from '..';

export interface FrameworkDelegate {
  attachViewToDom(navController: Nav, enteringView: ViewController): Promise<any>;
  removeViewFromDom(navController: Nav, leavingView: ViewController): Promise<any>;
}

export interface Nav {
  id?: number;
  element?: HTMLElement;
  views?: ViewController[];
  transitioning?: boolean;
  destroyed?: boolean;
  transitionId?: number;
  isViewInitialized?: boolean;
  isPortal?: boolean;
  zIndexOffset?: number;
  swipeToGoBackTransition?: any; // TODO Transition
  navController?: NavController;
  parent?: Nav;
  childNavs?: Nav[]; // TODO - make nav container
  root?: any;
  navInit?: EventEmitter;
  config?: Config;
  animationCtrl?: AnimationController;

  // public methods
  getActive(): ViewController;
  getPrevious(view?: ViewController): ViewController;
  getViews(): ViewController[];
  push(component: any, data?: any, opts?: NavOptions): Promise<any>;
  pop(opts?: NavOptions): Promise<any>;
  setRoot(component: any, data?: any, opts?: NavOptions): Promise<any>;
  insert(insertIndex: number, page: any, params?: any, opts?: NavOptions): Promise<any>;
  insertPages(insertIndex: number, insertPages: any[], opts?: NavOptions): Promise<any>;
  popToRoot(opts?: NavOptions): Promise<any>;
  popTo(indexOrViewCtrl: any, opts?: NavOptions): Promise<any>;
  remove(startIndex: number, removeCount?: number, opts?: NavOptions): Promise<any>;
  removeView(viewController: ViewController, opts?: NavOptions): Promise<any>;
  setPages(componentDataPairs: ComponentDataPair[], opts? : NavOptions): Promise<any>;
}

export interface NavController {
  push(nav: Nav, component: any, data: any, opts: NavOptions): Promise<any>;
  pop(nav: Nav, opts: NavOptions): Promise<any>;
  setRoot(nav: Nav, component: any, data: any, opts: NavOptions): Promise<any>;
  insert(nav: Nav, insertIndex: number, page: any, params: any, opts: NavOptions): Promise<any>;
  insertPages(nav: Nav, insertIndex: number, insertPages: any[], opts?: NavOptions): Promise<any>;
  popToRoot(nav: Nav, opts: NavOptions): Promise<any>;
  popTo(nav: Nav, indexOrViewCtrl: any, opts?: NavOptions): Promise<any>;
  remove(nav: Nav, startIndex: number, removeCount: number, opts: NavOptions): Promise<any>;
  removeView(nav: Nav, viewController: ViewController, opts?: NavOptions): Promise<any>;
  setPages(nav: Nav, componentDataPairs: ComponentDataPair[], opts? : NavOptions): Promise<any>;
  delegate?: FrameworkDelegate;
}

export interface ViewController {
  id: string;
  component: any;
  data: any;
  element: HTMLElement;
  instance: any;
  state: number;
  nav: Nav;
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

  destroy(delegate?: FrameworkDelegate): Promise<any>;
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
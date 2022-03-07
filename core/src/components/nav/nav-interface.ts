import { Animation, AnimationBuilder, ComponentProps, ComponentRef, FrameworkDelegate, Mode } from '../../interface';

import { ViewController } from './view-controller';

export type NavDirection = 'back' | 'forward';

export type NavComponent = ComponentRef | ViewController;
export interface NavComponentWithProps<T = any> {
  component: NavComponent;
  componentProps?: ComponentProps<T> | null;
}

export interface NavResult {
  hasCompleted: boolean;
  requiresTransition: boolean;
  enteringView?: ViewController;
  leavingView?: ViewController;
  direction?: NavDirection;
}

export interface SwipeGestureHandler {
  canStart(): boolean;
  onStart(): void;
  onEnd(shouldComplete: boolean): void;
}

export interface RouterOutletOptions {
  animated?: boolean;
  animationBuilder?: AnimationBuilder;
  duration?: number;
  easing?: string;
  showGoBack?: boolean;
  direction?: NavDirection;
  deepWait?: boolean;
  mode?: Mode;
  keyboardClose?: boolean;
  skipIfBusy?: boolean;
  progressAnimation?: boolean;
}

export interface NavOptions extends RouterOutletOptions {
  progressAnimation?: boolean;
  updateURL?: boolean;
  delegate?: FrameworkDelegate;
  viewIsReady?: (enteringEl: HTMLElement) => Promise<any>;
}

export type Page = new (...args: any[]) => any;

export type TransitionResolveFn = (hasCompleted: boolean, requiresTransition: boolean, enteringName?: string, leavingName?: string, direction?: string) => void;

export type TransitionRejectFn = (rejectReason: any, transition?: Animation) => void;

export type TransitionDoneFn = (hasCompleted: boolean, requiresTransition: boolean, enteringView?: ViewController, leavingView?: ViewController, direction?: string) => void;

export interface TransitionInstruction {
  opts: NavOptions | undefined | null;
  /** The index where to insert views. A negative number means at the end */
  insertStart?: number;
  insertViews?: any[];
  removeView?: ViewController;
  /** The index of the first view to remove. A negative number means the last view */
  removeStart?: number;
  /** The number of view to remove. A negative number means all views from removeStart */
  removeCount?: number;
  resolve?: (hasCompleted: boolean) => void;
  reject?: (rejectReason: string) => void;
  done?: TransitionDoneFn;
  leavingRequiresTransition?: boolean;
  enteringRequiresTransition?: boolean;
}

export interface NavCustomEvent extends CustomEvent {
  target: HTMLIonNavElement;
}

export { ViewController };

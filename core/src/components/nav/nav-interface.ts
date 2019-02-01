import { Animation, AnimationBuilder, ComponentRef, FrameworkDelegate, Mode } from '../../interface';

import { ViewController } from './view-controller';

export type NavDirection = 'back' | 'forward';

export type NavComponent = ComponentRef | ViewController;

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
  insertStart?: number;
  insertViews?: any[];
  removeView?: ViewController;
  removeStart?: number;
  removeCount?: number;
  resolve?: (hasCompleted: boolean) => void;
  reject?: (rejectReason: string) => void;
  done?: TransitionDoneFn;
  leavingRequiresTransition?: boolean;
  enteringRequiresTransition?: boolean;
}

export { ViewController };

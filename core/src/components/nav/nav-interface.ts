import type { AnimationBuilder, ComponentProps, ComponentRef, FrameworkDelegate, Mode, Theme } from '../../interface';

import type { ViewController } from './view-controller';

// TODO(FW-2832): types

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
  /**
   * @deprecated To change the default appearance of the popover, use the `theme` option.
   * `mode` is deprecated and the ability to set the platform mode will be removed in a major release.
   */
  mode?: Mode;
  theme?: Theme;
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

export type TransitionDoneFn = (
  hasCompleted: boolean,
  requiresTransition: boolean,
  enteringView?: ViewController,
  leavingView?: ViewController,
  direction?: string
) => void;

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

import { ViewController } from './view-controller';
import { Animation, ComponentRef, FrameworkDelegate } from '../../interface';

export { Nav } from './nav';

export type NavDirection = 'back' | 'forward';

export type NavComponent = ComponentRef | ViewController;

export interface NavResult {
  hasCompleted: boolean;
  requiresTransition: boolean;
  enteringView?: ViewController;
  leavingView?: ViewController;
  direction?: NavDirection;
}

export interface NavOptions {
  animate?: boolean;
  animation?: string;
  direction?: NavDirection;
  duration?: number;
  easing?: string;
  id?: string;
  keyboardClose?: boolean;
  progressAnimation?: boolean;
  ev?: any;
  updateURL?: boolean;
  delegate?: FrameworkDelegate;
  viewIsReady?: (enteringEl: HTMLElement) => Promise<any>;
}

export interface Page extends Function {
  new (...args: any[]): any;
}

export interface TransitionResolveFn {
  (hasCompleted: boolean, requiresTransition: boolean, enteringName?: string, leavingName?: string, direction?: string): void;
}

export interface TransitionRejectFn {
  (rejectReason: any, transition?: Animation): void;
}

export interface TransitionDoneFn {
  (hasCompleted: boolean, requiresTransition: boolean, enteringView?: ViewController, leavingView?: ViewController, direction?: string): void;
}

export interface TransitionInstruction {
  opts: NavOptions|undefined|null;
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

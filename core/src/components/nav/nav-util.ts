import { ViewController, isViewController } from './view-controller';
import { Animation, FrameworkDelegate } from '../..';

export function convertToView(page: any, params: any): ViewController|null {
  if (!page) {
    return null;
  }
  if (isViewController(page)) {
    return page;
  }
  return new ViewController(page, params);
}

export function convertToViews(pages: any[]): ViewController[] {
  return pages.map(page => {
    if (isViewController(page)) {
      return page;
    }
    if ('page' in page) {
      return convertToView(page.page, page.params);
    }
    return convertToView(page, undefined);
  }).filter(v => v !== null) as ViewController[];
}

export function isPresent(val: any): val is any {
  return val !== undefined && val !== null;
}

export const enum ViewState {
  New = 1,
  Attached,
  Destroyed
}

export const enum NavDirection {
  Back = 'back',
  Forward = 'forward'
}

export type NavParams = {[key: string]: any};

export interface NavResult {
  hasCompleted: boolean;
  requiresTransition: boolean;
  enteringView?: ViewController;
  leavingView?: ViewController;
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
  ev?: any;
  updateURL?: boolean;
  delegate?: FrameworkDelegate;
  viewIsReady?: () => Promise<any>;
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
  opts: NavOptions|undefined;
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
  requiresTransition?: boolean;
}

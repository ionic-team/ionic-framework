import { ViewController, isViewController } from './view-controller';
import { NavControllerBase } from './nav';
import { Transition } from './transition';

export function convertToView(page: any, params: any): ViewController {
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
  })
  .filter(v => v !== null);
}

export function setZIndex(nav: NavControllerBase, enteringView: ViewController, leavingView: ViewController, direction: string) {
  if (enteringView) {

    leavingView = leavingView || nav.getPrevious(enteringView);

    if (leavingView && isPresent(leavingView._zIndex)) {
      if (direction === NavDirection.back) {
        enteringView._setZIndex(leavingView._zIndex - 1);

      } else {
        enteringView._setZIndex(leavingView._zIndex + 1);
      }

    } else {
      enteringView._setZIndex(INIT_ZINDEX);
    }
  }
}

export function isPresent(val: any): val is any {
  return val !== undefined && val !== null;
}

export const enum ViewState {
  New = 1,
  Initialized,
  Attached,
  Destroyed
}

export const enum NavDirection {
  back = 'back',
  forward = 'forward'
}

export const INIT_ZINDEX = 100;

export type NavParams = {[key: string]: any};

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
  minClickBlockDuration?: number;
  ev?: any;
  updateUrl?: boolean;
  isNavRoot?: boolean;
  viewIsReady?: () => Promise<any>;
}

export interface Page extends Function {
  new (...args: any[]): any;
}

export interface TransitionResolveFn {
  (hasCompleted: boolean, requiresTransition: boolean, enteringName?: string, leavingName?: string, direction?: string): void;
}

export interface TransitionRejectFn {
  (rejectReason: any, transition?: Transition): void;
}

export interface TransitionDoneFn {
  (hasCompleted: boolean, requiresTransition: boolean, enteringName?: string, leavingName?: string, direction?: string): void;
}

export interface TransitionInstruction {
  opts: NavOptions;
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

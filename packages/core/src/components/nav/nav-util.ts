import { ViewController, isViewController } from './view-controller';
import { NavControllerBase } from './nav';
import { Transition } from './transition';


export type NavParams = {[key: string]: any};

export interface PageMeta {
  page:  string | HTMLElement | ViewController;
  params?: any;
}

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
  return pages
    .map(page => {
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
      if (direction === DIRECTION_BACK) {
        enteringView._setZIndex(leavingView._zIndex - 1);

      } else {
        enteringView._setZIndex(leavingView._zIndex + 1);
      }

    } else {
      enteringView._setZIndex(INIT_ZINDEX);
    }
  }
}

export function isTabs(nav: any): boolean {
  // Tabs (ion-tabs)
  return !!nav && !!nav.getSelected;
}

export function isTab(nav: any): boolean {
  // Tab (ion-tab)
  return !!nav && isPresent(nav._tabId);
}

export function isNav(nav: any): boolean {
  // Nav (ion-nav), Tab (ion-tab), Portal (ion-portal)
  return !!nav && !!nav.push && nav.getType() === 'nav';
}

export function linkToSegment(navId: string, type: string, secondaryId: string, link: NavLink): NavSegment {
  const segment = <NavSegment> Object.assign({}, link);
  segment.navId = navId;
  segment.type = type;
  segment.secondaryId = secondaryId;
  return segment;
}


// internal link interface, not exposed publicly
export interface NavLink {
  component?: any;
  loadChildren?: string;
  name?: string;
  segment?: string;
  segmentParts?: string[];
  segmentPartsLen?: number;
  staticLen?: number;
  dataLen?: number;
  dataKeys?: {[key: string]: boolean};
  defaultHistory?: any[];
}

export interface NavResult {
  hasCompleted: boolean;
  requiresTransition: boolean;
  enteringName?: string;
  leavingName?: string;
  direction?: string;
}

export interface NavSegment extends DehydratedSegment {
  type: string;
  navId: string;
  secondaryId: string;
  requiresExplicitNavPrefix?: boolean;
}

export interface DehydratedSegment {
  id: string;
  name: string;
  component?: any;
  loadChildren?: string;
  data: any;
  defaultHistory?: NavSegment[];
  secondaryId?: string;
}

export interface DehydratedSegmentPair {
  segments: DehydratedSegment[];
  navGroup: NavGroup;
}

export interface NavGroup {
  type: string;
  navId: string;
  secondaryId: string;
  segmentPieces?: string[];
  tabSegmentPieces?: string[];
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

export function isPresent(val: any): val is any { return val !== undefined && val !== null; }

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

export const STATE_NEW = 1;
export const STATE_INITIALIZED = 2;
export const STATE_ATTACHED = 3;
export const STATE_DESTROYED = 4;

export const INIT_ZINDEX = 100;

export const DIRECTION_BACK = 'back';
export const DIRECTION_FORWARD = 'forward';
export const DIRECTION_SWITCH = 'switch';

export const NAV = 'nav';
export const TABS = 'tabs';

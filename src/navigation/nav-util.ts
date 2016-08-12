import { ComponentRef, Renderer } from '@angular/core';

import { DeepLinker } from './deep-linker';
import { isBoolean, isPresent } from '../util/util';
import { NavControllerBase } from './nav-controller-base';
import { ViewController } from './view-controller';

export function convertToViews(linker: DeepLinker, pages: Array<{page: any, params?: any}>): ViewController[] {
  const views: ViewController[] = [];
  if (pages) {
    for (var i = 0; i < pages.length; i++) {
      var componentType: any = linker.getComponent(pages[i].page) || pages[i].page;
      if (componentType) {
        if (typeof componentType !== 'function') {
          console.error(`invalid component for nav: ${componentType}`);

        } else {
          views.push(new ViewController(componentType, pages[i].params));
        }
      }
    }
  }
  return views;
}


export function lifecycleTest(view: ViewController, lifecycle: string, testDone: TestDone) {
  const testResult: TestResult = { valid: true, rejectReason: null };

  if (view.instance && view.instance['ionViewCan' + lifecycle]) {
    try {
      const result = view.instance['ionViewCan' + lifecycle];
      if (result === false) {
        // synchronous: rejected cuz of boolean false
        testResult.valid = false;

      } else if (result instanceof Promise) {
        // async: wait for promise to resolve
        result.then((userResponse: any) => {
          // user's promise has resolved
          if (isPresent(userResponse)) {
            if (isBoolean(userResponse)) {
              testResult.valid = userResponse;

            } else {
              testResult.valid = !!userResponse;
              testResult.rejectReason = userResponse;
            }
          }

          testDone(testResult);
        });
        return;
      }

    } catch (e) {
      // synchronous
      console.error(e);
    }
  }

  // synchronous: there was no test
  testDone(testResult);
}


export function setZIndex(nav: NavControllerBase, enteringView: ViewController, leavingView: ViewController, direction: string, renderer: Renderer) {
  if (enteringView) {
    // get the leaving view, which could be in various states
    if (!leavingView || !leavingView._loaded) {
      // the leavingView is a mocked view, either we're
      // actively transitioning or it's the initial load

      const previousView = nav.getPrevious(enteringView);
      if (previousView && previousView._loaded) {
        // we found a better previous view to reference
        // use this one instead
        enteringView._setZIndex(previousView.zIndex + 1, renderer);

      } else {
        // this is the initial view
        enteringView._setZIndex(nav._isPortal ? PORTAL_ZINDEX : INIT_ZINDEX, renderer);
      }

    } else if (direction === DIRECTION_BACK) {
      // moving back
      enteringView._setZIndex(leavingView.zIndex - 1, renderer);

    } else {
      // moving forward
      enteringView._setZIndex(leavingView.zIndex + 1, renderer);
    }
  }
}

export function isTabs(nav: any) {
  // Tabs (ion-tabs)
  return !!nav && !!nav.getSelected;
}

export function isTab(nav: any) {
  // Tab (ion-tab)
  return !!nav && isPresent(nav._tabId);
}

export function isNav(nav: any) {
  // Nav (ion-nav), Tab (ion-tab), Portal (ion-portal)
  return !!nav && !!nav.push;
}

// simple public link interface
export interface DeepLink {
  component: any;
  name: string;
  path?: string;
}

export interface DeepLinkConfig {
  links: DeepLink[];
}

// internal link interface, not exposed publicly
export interface NavLink {
  component: any;
  name?: string;
  path?: string;
  parts?: string[];
  staticParts?: number;
  dataParts?: number;
}

export interface NavSegment {
  id: string;
  name: string;
  component: any;
  data: any;
  navId?: string;
}

export type NavPath = NavSegment[];

export interface NavOptions {
  animate?: boolean;
  animation?: string;
  direction?: string;
  duration?: number;
  easing?: string;
  id?: string;
  keyboardClose?: boolean;
  transitionDelay?: number;
  progressAnimation?: boolean;
  climbNav?: boolean;
  ev?: any;
  updateUrl?: boolean;
  isNavRoot?: boolean;
}

export interface TransitionResult {
  hasCompleted: boolean;
  valid?: boolean;
  rejectReason?: string;
  resultData?: any;
}

export interface TestDone {
  (testResult: TestResult): void
}

export interface TestResult {
  valid: boolean;
  rejectReason?: any;
  componentRef?: ComponentRef<any>
}

export const STATE_ACTIVE = 1;
export const STATE_INACTIVE = 2;
export const STATE_INIT_ENTER = 3;
export const STATE_INIT_LEAVE = 4;
export const STATE_TRANS_ENTER = 5;
export const STATE_TRANS_LEAVE = 6;
export const STATE_REMOVE = 7;
export const STATE_REMOVE_AFTER_TRANS = 8;
export const STATE_CANCEL_ENTER = 9;
export const STATE_FORCE_ACTIVE = 10;

export const INIT_ZINDEX = 100;
export const PORTAL_ZINDEX = 9999;

export const DIRECTION_BACK = 'back';
export const DIRECTION_FORWARD = 'forward';

import { Renderer } from '@angular/core';

import { DeepLinker } from './deep-linker';
import { isPresent } from '../util/util';
import { isViewController, ViewController } from './view-controller';
import { NavControllerBase } from './nav-controller-base';
import { Transition } from '../transitions/transition';


export function convertToViews(linker: DeepLinker, pages: any[]): ViewController[] {
  const views: ViewController[] = [];
  if (pages) {
    for (var i = 0; i < pages.length; i++) {
      if (isViewController(pages[i])) {
        views.push(pages[i]);

      } else {
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
  }
  return views;
}

export function setZIndex(nav: NavControllerBase, enteringView: ViewController, leavingView: ViewController, direction: string, renderer: Renderer) {
  if (enteringView) {
    // get the leaving view, which could be in various states
    if (!leavingView) {
      const previousView = nav.getPrevious(enteringView);
      if (previousView && previousView._state === ViewState.LOADED) {
        // we found a better previous view to reference
        // use this one instead
        enteringView._setZIndex(previousView._zIndex + 1, renderer);

      } else {
        // this is the initial view
        enteringView._setZIndex(nav._isPortal ? PORTAL_ZINDEX : INIT_ZINDEX, renderer);
      }

    } else if (direction === DIRECTION_BACK) {
      // moving back
      enteringView._setZIndex(leavingView._zIndex - 1, renderer);

    } else {
      // moving forward
      enteringView._setZIndex(leavingView._zIndex + 1, renderer);
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
  progressAnimation?: boolean;
  ev?: any;
  updateUrl?: boolean;
  isNavRoot?: boolean;
}

export interface TransitionResolveFn {
  (hasCompleted: boolean): void;
}

export interface TransitionRejectFn {
  (rejectReason: any, transition?: Transition): void;
}

export interface TransitionInstruction {
  opts: NavOptions;
  insertStart?: number;
  insertViews?: ViewController[];
  removeStart?: number;
  removeCount?: number;
  resolve?: TransitionResolveFn;
  reject?: TransitionRejectFn;
}

export enum ViewState {
  INITIALIZED,
  PRE_RENDERED,
  LOADED,
}

export const INIT_ZINDEX = 100;
export const PORTAL_ZINDEX = 9999;

export const DIRECTION_BACK = 'back';
export const DIRECTION_FORWARD = 'forward';
export const DIRECTION_SWITCH = 'switch';

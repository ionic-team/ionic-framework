import { Renderer, TypeDecorator } from '@angular/core';

import { DeepLinker } from './deep-linker';
import { isArray, isPresent } from '../util/util';
import { isViewController, ViewController } from './view-controller';
import { NavControllerBase } from './nav-controller-base';
import { Transition } from '../transitions/transition';


export function getComponent(linker: DeepLinker, nameOrPageOrView: any): any {
  if (typeof nameOrPageOrView === 'function') {
    return nameOrPageOrView;
  }
  if (typeof nameOrPageOrView === 'string') {
    return linker.getComponentFromName(nameOrPageOrView);
  }
  return null;
}

export function convertToView(linker: DeepLinker, nameOrPageOrView: any, params: any): ViewController {
  if (nameOrPageOrView) {
    if (isViewController(nameOrPageOrView)) {
      // is already a ViewController
      return nameOrPageOrView;
    }
    let component = getComponent(linker, nameOrPageOrView);
    if (component) {
      return new ViewController(component, params);
    }
  }
  console.error(`invalid page component: ${nameOrPageOrView}`);
  return null;
}

export function convertToViews(linker: DeepLinker, pages: any[]): ViewController[] {
  const views: ViewController[] = [];
  if (isArray(pages)) {
    for (var i = 0; i < pages.length; i++) {
      var page = pages[i];
      if (page) {
        if (isViewController(page)) {
          views.push(page);

        } else if (page.page) {
          views.push(convertToView(linker, page.page, page.params));

        } else {
          views.push(convertToView(linker, page, null));
        }
      }
    }
  }
  return views;
}

let portalZindex = 9999;

export function setZIndex(nav: NavControllerBase, enteringView: ViewController, leavingView: ViewController, direction: string, renderer: Renderer) {
  if (enteringView) {
    if (nav._isPortal) {
      if (direction === DIRECTION_FORWARD) {
        enteringView._setZIndex(nav._zIndexOffset + portalZindex, renderer);
      }
      portalZindex++;
      return;
    }

    leavingView = leavingView || nav.getPrevious(enteringView);

    if (leavingView && isPresent(leavingView._zIndex)) {
      if (direction === DIRECTION_BACK) {
        enteringView._setZIndex(leavingView._zIndex - 1, renderer);

      } else {
        enteringView._setZIndex(leavingView._zIndex + 1, renderer);
      }

    } else {
      enteringView._setZIndex(INIT_ZINDEX + nav._zIndexOffset, renderer);
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
  return !!nav && !!nav.push;
}

// public link interface
export interface DeepLinkMetadataType {
  name: string;
  segment?: string;
  defaultHistory?: any[];
}

/**
 * @private
 */
export class DeepLinkMetadata implements DeepLinkMetadataType {
  component: any;
  name: string;
  segment?: string;
  defaultHistory?: any[];
}

export interface DeepLinkDecorator extends TypeDecorator {}

export interface DeepLinkMetadataFactory {
  (obj: DeepLinkMetadataType): DeepLinkDecorator;
  new (obj: DeepLinkMetadataType): DeepLinkMetadata;
}

/**
 * @private
 */
export var DeepLink: DeepLinkMetadataFactory;

/**
 * @private
 */
export interface DeepLinkConfig {
  links: DeepLinkMetadata[];
}

// internal link interface, not exposed publicly
export interface NavLink {
  component: any;
  name?: string;
  segment?: string;
  parts?: string[];
  partsLen?: number;
  staticLen?: number;
  dataLen?: number;
  dataKeys?: {[key: string]: boolean};
  defaultHistory?: any[];
}

export interface NavSegment {
  id: string;
  name: string;
  component: any;
  data: any;
  navId?: string;
  defaultHistory?: NavSegment[];
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
}

export interface TransitionResolveFn {
  (hasCompleted: boolean, requiresTransition: boolean, enteringName?: string, leavingName?: string, direction?: string): void;
}

export interface TransitionRejectFn {
  (rejectReason: any, transition?: Transition): void;
}

export interface TransitionInstruction {
  opts: NavOptions;
  insertStart?: number;
  insertViews?: ViewController[];
  removeView?: ViewController;
  removeStart?: number;
  removeCount?: number;
  resolve?: TransitionResolveFn;
  reject?: TransitionRejectFn;
  leavingRequiresTransition?: boolean;
  enteringRequiresTransition?: boolean;
  requiresTransition?: boolean;
}

export enum ViewState {
  NEW, // New created ViewController
  INITIALIZED, // Initialized by the NavController
  ATTACHED, // Loaded to the DOM
  DESTROYED // Destroyed by the NavController
}

export const INIT_ZINDEX = 100;

export const DIRECTION_BACK = 'back';
export const DIRECTION_FORWARD = 'forward';
export const DIRECTION_SWITCH = 'switch';

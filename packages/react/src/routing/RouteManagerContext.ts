import React from 'react';

import type { RouteInfo } from '../models/RouteInfo';

import type { ViewItem } from './ViewItem';

export interface RouteManagerContextState {
  addViewItem: (viewItem: ViewItem) => void;
  canGoBack: () => boolean;
  clearOutlet: (outletId: string) => void;
  createViewItem: (
    outletId: string,
    reactElement: React.ReactElement,
    routeInfo: RouteInfo,
    page?: HTMLElement
  ) => ViewItem;
  findViewItemByPathname(pathname: string, outletId?: string, forceExact?: boolean): ViewItem | undefined;
  findLeavingViewItemByRouteInfo: (routeInfo: RouteInfo, outletId?: string) => ViewItem | undefined;
  findViewItemByRouteInfo: (routeInfo: RouteInfo, outletId?: string, updateMatch?: boolean) => ViewItem | undefined;
  getChildrenToRender: (
    outletId: string,
    ionRouterOutlet: React.ReactElement,
    routeInfo: RouteInfo
  ) => React.ReactNode[];
  goBack: () => void;
  /**
   * Returns the number of active stacks.
   * This is useful for determining if an app
   * is using linear navigation only or non-linear
   * navigation. Multiple stacks indicate an app
   * is using non-linear navigation.
   */
  size: () => number;
  /**
   * When navigating backwards, we need to clean up and
   * leaving pages so that they are re-created if
   * we ever navigate back to them. This is especially
   * important when using router.go and stepping back
   * multiple pages at a time.
   */
  unmountLeavingViews: (outletId: string, viewItem: ViewItem, delta?: number) => void;
  /**
   * When navigating forward it is possible for
   * developers to step forward over multiple views.
   * The intermediary views need to be remounted so that
   * swipe to go back works properly.
   * We need to account for the delta value here too because
   * we do not want to remount an unrelated view.
   * Example:
   * /home --> /page2 --> router.back() --> /page3
   * Going to /page3 would remount /page2 since we do
   * not prune /page2 from the stack. However, /page2
   * needs to remain in the stack.
   * Example:
   * /home --> /page2 --> /page3 --> router.go(-2) --> router.go(2)
   * We would end up on /page3, but users need to be able to swipe
   * to go back to /page2 and /home, so we need both pages mounted
   * in the DOM.
   */
  mountIntermediaryViews: (outletId: string, viewItem: ViewItem, delta?: number) => void;
  unMountViewItem: (viewItem: ViewItem) => void;
  registerIonPage: (viewItem: ViewItem, ionPage: HTMLElement) => void;
}

// TODO(FW-2959): types
export const RouteManagerContext = /*@__PURE__*/ React.createContext<RouteManagerContextState>({
  addViewItem: () => undefined,
  canGoBack: () => undefined as any,
  clearOutlet: () => undefined,
  createViewItem: () => undefined as any,
  findViewItemByPathname: () => undefined,
  findLeavingViewItemByRouteInfo: () => undefined,
  findViewItemByRouteInfo: () => undefined,
  getChildrenToRender: () => [],
  goBack: () => undefined,
  size: () => 0,
  unmountLeavingViews: () => undefined,
  mountIntermediaryViews: () => undefined,
  unMountViewItem: () => undefined,
  registerIonPage: () => undefined
});

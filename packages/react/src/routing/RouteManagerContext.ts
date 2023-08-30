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
  unMountViewItem: () => undefined,
  registerIonPage: () => undefined
});

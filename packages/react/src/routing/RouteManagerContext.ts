import React from 'react';

import { RouteInfo } from '../models/RouteInfo';

import { ViewItem } from './ViewItem';

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
  findViewItemByPathname(pathname: string, outletId?: string): ViewItem | undefined;
  findLeavingViewItemByRouteInfo: (routeInfo: RouteInfo, outletId?: string) => ViewItem | undefined;
  findViewItemByRouteInfo: (routeInfo: RouteInfo, outletId?: string) => ViewItem | undefined;
  getChildrenToRender: (
    outletId: string,
    ionRouterOutlet: React.ReactElement,
    routeInfo: RouteInfo,
    reRender: () => void
  ) => React.ReactNode[];
  goBack: () => void;
  unMountViewItem: (viewItem: ViewItem) => void;
}

export const RouteManagerContext = /*@__PURE__*/ React.createContext<RouteManagerContextState>({
  addViewItem: () => undefined,
  canGoBack: () => undefined as any,
  clearOutlet: () => undefined,
  createViewItem: () => undefined as any,
  findViewItemByPathname: () => undefined,
  findLeavingViewItemByRouteInfo: () => undefined,
  findViewItemByRouteInfo: () => undefined,
  getChildrenToRender: () => undefined as any,
  goBack: () => undefined,
  unMountViewItem: () => undefined,
});

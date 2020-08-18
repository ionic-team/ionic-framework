import React from 'react';

import { RouteInfo } from '../models/RouteInfo';

import { ViewItem } from './ViewItem';

export interface RouteManagerContextState {
  addViewItem: (viewItem: ViewItem) => void;
  canGoBack: () => boolean;
  clearOutlet: (outletId: string) => void;
  createViewItem: (outletId: string, reactElement: React.ReactElement, routeInfo: RouteInfo, page?: HTMLElement) => ViewItem;
  findLeavingViewItemByRouteInfo: (routeInfo: RouteInfo, outletId?: string) => ViewItem | undefined;
  findViewItemByRouteInfo: (routeInfo: RouteInfo, outletId?: string) => ViewItem | undefined;
  getChildrenToRender: (outletId: string, ionRouterOutlet: React.ReactElement, routeInfo: RouteInfo, reRender: () => void) => React.ReactNode[];
  getViewItemForTransition: (pathname: string) => ViewItem | undefined;
  goBack: () => void;
  unMountViewItem: (viewItem: ViewItem) => void;
}

export const RouteManagerContext = /*@__PURE__*/React.createContext<RouteManagerContextState>({
  addViewItem: () => undefined,
  canGoBack: () => undefined as any,
  clearOutlet: () => undefined,
  createViewItem: () => undefined as any,
  findLeavingViewItemByRouteInfo: () => undefined,
  findViewItemByRouteInfo: () => undefined,
  getChildrenToRender: () => undefined as any,
  getViewItemForTransition: () => undefined,
  goBack: () => undefined,
  unMountViewItem: () => undefined,
});

import React from 'react';

import { RouteInfo } from '../models/RouteInfo';

import { ViewItem } from './ViewItem';

export interface RouteManagerContextState {
  addViewItem: (viewItem: ViewItem) => void;
  clearOutlet: (outletId: string) => void;
  createViewItem: (outletId: string, reactElement: React.ReactElement, routeInfo: RouteInfo, page?: HTMLElement) => ViewItem;
  findLeavingViewItemByRouteInfo: (outletId: string, routeInfo: RouteInfo) => ViewItem | undefined;
  findViewItemByPathname: (pathname: string, outletId?: string) => ViewItem | undefined;
  findViewItemByRouteInfo: (outletId: string, routeInfo: RouteInfo) => ViewItem | undefined;
  getChildrenToRender: (outletId: string, ionRouterOutlet: React.ReactElement, routeInfo: RouteInfo) => React.ReactNode[];
  getViewItemForTransition: (pathname: string) => ViewItem | undefined;
  onRouteChange: (callback: (routeInfo: RouteInfo) => void) => () => void;
  unMountViewItem: (viewItem: ViewItem) => void;
}

export const RouteManagerContext = /*@__PURE__*/React.createContext<RouteManagerContextState>({
  addViewItem: () => undefined,
  clearOutlet: () => undefined,
  createViewItem: () => undefined as any,
  findLeavingViewItemByRouteInfo: () => undefined,
  findViewItemByPathname: () => undefined,
  findViewItemByRouteInfo: () => undefined,
  getChildrenToRender: () => undefined as any,
  getViewItemForTransition: () => undefined,
  onRouteChange: () => () => undefined,
  unMountViewItem: () => undefined,
});

import React from 'react';

import { RouteInfo } from '../models/RouteInfo';

import { ViewItem } from './ViewItem';

export interface RouteManagerContextState {
  // routerInfo: RouteInfo;
  // exitViewFromOtherOutlet: (pathname: string) => ViewItem | undefined;
  onRouteChange: (callback: (routeInfo: RouteInfo) => void) => () => void;
  // registerExitViewFromOtherOutlet: (callback: (pathname: string) => ViewItem | undefined) => () => void;
  getViewItemForTransition: (pathname: string) => ViewItem | undefined;
  addViewItem: (viewItem: ViewItem) => void;
  createViewItem: (outletId: string, reactElement: React.ReactElement, routeInfo: RouteInfo, page?: HTMLElement) => ViewItem;
  findViewItemByPathname: (pathname: string, outletId?: string) => ViewItem | undefined;
  findViewItemByRouteInfo: (outletId: string, routeInfo: RouteInfo) => ViewItem | undefined;
  findLeavingViewItemByRouteInfo: (outletId: string, routeInfo: RouteInfo) => ViewItem | undefined;
  unMountViewItem: (viewItem: ViewItem) => void;
  getChildrenToRender: (outletId: string, ionRouterOutlet: React.ReactElement, routeInfo: RouteInfo) => React.ReactNode[];

  // matchComponent: (children: React.ReactNode, routeInfo: RouteInfo) => React.ReactNode;
  // createViewItem: (page: HTMLElement, reactElement: React.ReactElement) => ViewItem;
  // findViewItemByRoute: (routeInfo: RouteInfo, viewItems: ViewItem[]) => ViewItem; // TODO implement this
  // onSetupFirstPage: (callback: (routeInfo: RouteInfo) => void) => void;
}

export const RouteManagerContext = /*@__PURE__*/React.createContext<RouteManagerContextState>({
  // routerInfo: null as any,
  // exitViewFromOtherOutlet: () => undefined,
  // registerExitViewFromOtherOutlet: () => () => undefined,
  onRouteChange: () => () => undefined,
  getViewItemForTransition: () => undefined,
  addViewItem: () => undefined,
  createViewItem: () => undefined as any,
  findViewItemByPathname: () => undefined,
  findViewItemByRouteInfo: () => undefined,
  findLeavingViewItemByRouteInfo: () => undefined,
  unMountViewItem: () => undefined,
  getChildrenToRender: () => undefined as any
  // matchComponent: () => undefined,
  // createViewItem: () => undefined as any,
  // findViewItemByRoute: () => undefined as any,
  // onSetupFirstPage: () => undefined
});

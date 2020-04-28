import React from 'react';

import { RouteInfo } from '../models/RouteInfo';

import { ViewItem } from './ViewItem';

export interface RouteManagerContextState {
  // routerInfo: RouteInfo;
  // exitViewFromOtherOutlet: (pathname: string) => ViewItem | undefined;
  onRouteChange: (callback: (routeInfo: RouteInfo) => void) => () => void;
  // registerExitViewFromOtherOutlet: (callback: (pathname: string) => ViewItem | undefined) => () => void;
  storeViewItemForTransition: (pathname: string, viewItem: ViewItem) => void;
  getViewItemForTransition: (pathname: string) => ViewItem | undefined;
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
  storeViewItemForTransition: () => undefined,
  getViewItemForTransition: () => undefined
  // matchComponent: () => undefined,
  // createViewItem: () => undefined as any,
  // findViewItemByRoute: () => undefined as any,
  // onSetupFirstPage: () => undefined
});

import React from 'react';

import { RouteInfo } from '../models/RouteInfo';

export interface RouteManagerContextState {
  // routerInfo: RouteInfo;
  exitViewFromOtherOutlet: (pathname: string) => void;
  onRouteChange: (callback: (routeInfo: RouteInfo) => void) => () => void;
  onExitViewFromOtherOutlet: (callback: (pathname: string) => void) => () => void;
  // matchComponent: (children: React.ReactNode, routeInfo: RouteInfo) => React.ReactNode;
  // createViewItem: (page: HTMLElement, reactElement: React.ReactElement) => ViewItem;
  // findViewItemByRoute: (routeInfo: RouteInfo, viewItems: ViewItem[]) => ViewItem; // TODO implement this
  // onSetupFirstPage: (callback: (routeInfo: RouteInfo) => void) => void;
}

export const RouteManagerContext = /*@__PURE__*/React.createContext<RouteManagerContextState>({
  // routerInfo: null as any,
  exitViewFromOtherOutlet: () => undefined,
  onExitViewFromOtherOutlet: () => () => undefined,
  onRouteChange: () => () => undefined,
  // matchComponent: () => undefined,
  // createViewItem: () => undefined as any,
  // findViewItemByRoute: () => undefined as any,
  // onSetupFirstPage: () => undefined
});

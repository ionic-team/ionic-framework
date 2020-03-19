import React from 'react';

import { RouteInfo } from '../models/RouteInfo';

export interface RouteManagerContextState {
  routerInfo: RouteInfo;
  onRouteChange: (callback: (routeInfo: RouteInfo) => void) => void;
  onSetupFirstPage: (callback: (routeInfo: RouteInfo) => void) => void;
}

export const RouteManagerContext = /*@__PURE__*/React.createContext<RouteManagerContextState>({
  routerInfo: null as any,
  onRouteChange: () => undefined,
  onSetupFirstPage: () => undefined
});

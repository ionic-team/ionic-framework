import { AnimationBuilder, RouterDirection } from '@ionic/core';
import React from 'react';

import { RouteInfo } from '../models';

export interface NavContextState {
  getIonRoute: () => any;
  getIonRedirect: () => any;
  getPageManager: () => any;
  getStackManager: () => any;
  goBack: (route?: string | RouteInfo, animationBuilder?: AnimationBuilder) => void;
  navigate: (
    path: string,
    direction?: RouterDirection | 'none',
    ionRouteAction?: 'push' | 'replace' | 'pop',
    animationBuilder?: AnimationBuilder,
    options?: any,
    tab?: string
  ) => void;
  hasIonicRouter: () => boolean;
  routeInfo?: RouteInfo;
  setCurrentTab: (tab: string, routeInfo: RouteInfo) => void;
  changeTab: (tab: string, path: string, routeOptions?: any) => void;
  resetTab: (tab: string, originalHref: string, originalRouteOptions?: any) => void;
}

export const NavContext = /*@__PURE__*/ React.createContext<NavContextState>({
  getIonRedirect: () => undefined,
  getIonRoute: () => undefined,
  getPageManager: () => undefined,
  getStackManager: () => undefined,
  goBack: (route?: string | RouteInfo) => {
    if (typeof window !== 'undefined') {
      if (typeof route === 'string') {
        window.location.pathname = route;
      } else {
        window.history.back();
      }
    }
  },
  navigate: (path: string) => {
    if (typeof window !== 'undefined') {
      window.location.pathname = path;
    }
  },
  hasIonicRouter: () => false,
  routeInfo: undefined,
  setCurrentTab: () => undefined,
  changeTab: (_tab: string, path: string) => {
    if (typeof window !== 'undefined') {
      window.location.pathname = path;
    }
  },
  resetTab: (_tab: string, path: string) => {
    if (typeof window !== 'undefined') {
      window.location.pathname = path;
    }
  },
});

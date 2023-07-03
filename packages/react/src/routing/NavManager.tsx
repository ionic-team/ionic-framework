import type { AnimationBuilder } from '@ionic/core/components';
import type { PropsWithChildren } from 'react';
import React, { useCallback, useEffect } from 'react';

import type { IonRouterContextState } from '../components/IonRouterContext';
import { IonRouterContext } from '../components/IonRouterContext';
import { NavContext } from '../contexts/NavContext';
import type { RouteAction } from '../models/RouteAction';
import type { RouteInfo } from '../models/RouteInfo';
import type { RouterDirection } from '../models/RouterDirection';
import type { RouterOptions } from '../models/RouterOptions';

import type { LocationHistory } from './LocationHistory';
import PageManager from './PageManager';

// TODO(FW-2959): types

interface NavManagerProps {
  routeInfo: RouteInfo;
  onNativeBack: () => void;
  onNavigateBack: (route?: string | RouteInfo, animationBuilder?: AnimationBuilder) => void;
  onNavigate: (
    path: string,
    action: RouteAction,
    direction?: RouterDirection,
    animationBuilder?: AnimationBuilder,
    options?: any,
    tab?: string
  ) => void;
  onSetCurrentTab: (tab: string, routeInfo: RouteInfo) => void;
  onChangeTab: (tab: string, path: string, routeOptions?: any) => void;
  onResetTab: (tab: string, path: string, routeOptions?: any) => void;
  ionRedirect: any;
  ionRoute: any;
  stackManager: any;
  locationHistory: LocationHistory;
}

export const NavManager = ({ children, ...props }: PropsWithChildren<NavManagerProps>) => {
  const {
    routeInfo,
    onNativeBack,
    onNavigateBack,
    onNavigate,
    onSetCurrentTab,
    onChangeTab,
    onResetTab,
    stackManager,
    ionRedirect,
    ionRoute,
    locationHistory,
  } = props;

  const getPageManager = useCallback(() => PageManager, []);
  const getIonRedirect = useCallback(() => ionRedirect, []);
  const getIonRoute = useCallback(() => ionRoute, []);
  const getStackManager = useCallback(() => stackManager, []);

  const ionRouterContextValue: IonRouterContextState = {
    push: (
      pathname: string,
      routerDirection?: RouterDirection,
      routeAction?: RouteAction,
      routerOptions?: RouterOptions,
      animationBuilder?: AnimationBuilder
    ) => {
      navigate(pathname, routerDirection, routeAction, animationBuilder, routerOptions);
    },
    back: (animationBuilder?: AnimationBuilder) => {
      goBack(undefined, animationBuilder);
    },
    canGoBack: () => locationHistory.canGoBack(),
    nativeBack: () => onNativeBack(),
    routeInfo,
  };

  useEffect(() => {
    const handleHardwareBackButton = (e: any) => {
      e.detail.register(0, (processNextHandler: () => void) => {
        onNativeBack();
        processNextHandler();
      });
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('ionBackButton', handleHardwareBackButton);
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('ionBackButton', handleHardwareBackButton);
      }
    };
  }, []);

  const goBack = (route?: string | RouteInfo, animationBuilder?: AnimationBuilder) => {
    onNavigateBack(route, animationBuilder);
  };

  const navigate = (
    path: string,
    direction: RouterDirection = 'forward',
    action: RouteAction = 'push',
    animationBuilder?: AnimationBuilder,
    options?: any,
    tab?: string
  ) => {
    onNavigate(path, action, direction, animationBuilder, options, tab);
  };

  return (
    <NavContext.Provider
      value={{
        goBack,
        hasIonicRouter: () => true,
        navigate,
        getIonRedirect,
        getIonRoute,
        getStackManager,
        getPageManager,
        routeInfo,
        setCurrentTab: onSetCurrentTab,
        changeTab: onChangeTab,
        resetTab: onResetTab,
      }}
    >
      <IonRouterContext.Provider value={{ ...ionRouterContextValue, routeInfo }}>{children}</IonRouterContext.Provider>
    </NavContext.Provider>
  );
};

import type { AnimationBuilder, RouteAction, RouteInfo, RouteManagerContextState, RouterDirection } from '@ionic/react';
import { LocationHistory, NavManager, RouteManagerContext, generateId, getConfig } from '@ionic/react';
import type { Action as HistoryAction, Location as HistoryLocation } from 'history';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { IonRouteInner } from './IonRouteInner';
import { ReactRouterViewStack } from './ReactRouterViewStack';
import StackManager from './StackManager';

export interface LocationState {
  direction?: RouterDirection;
  routerOptions?: { as?: string; unmount?: boolean };
}

interface IonRouterProps {
  registerHistoryListener: (cb: (location: HistoryLocation<any>, action: HistoryAction) => void) => void;
}

export const IonRouter = ({ children, registerHistoryListener }: PropsWithChildren<IonRouterProps>) => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const didMountRef = useRef(false);
  const locationHistory = useRef(new LocationHistory());
  const currentTab = useRef<string | undefined>(undefined);
  const viewStack = useRef(new ReactRouterViewStack());
  const incomingRouteParams = useRef<Partial<RouteInfo> | null>(null);

  const [routeInfo, setRouteInfo] = useState({
    id: generateId('routeInfo'),
    pathname: location.pathname,
    search: location.search,
  });

  useEffect(() => {
    didMountRef.current = true;
  }, []);

  const handleHistoryChange = (location: HistoryLocation<LocationState>, action: HistoryAction) => {
    let leavingLocationInfo: RouteInfo;
    if (incomingRouteParams) {
      if (incomingRouteParams.current?.routeAction === 'replace') {
        leavingLocationInfo = locationHistory.current.previous();
      } else {
        leavingLocationInfo = locationHistory.current.current();
      }
    } else {
      leavingLocationInfo = locationHistory.current.current();
    }

    const leavingUrl = leavingLocationInfo.pathname + leavingLocationInfo.search;
    if (leavingUrl !== location.pathname) {
      if (!incomingRouteParams.current) {
        if (action === 'REPLACE') {
          incomingRouteParams.current = {
            routeAction: 'replace',
            routeDirection: 'none',
            tab: currentTab.current,
          };
        }
        if (action === 'POP') {
          const currentRoute = locationHistory.current.current();
          if (currentRoute && currentRoute.pushedByRoute) {
            const prevInfo = locationHistory.current.findLastLocation(currentRoute);
            incomingRouteParams.current = { ...prevInfo, routeAction: 'pop', routeDirection: 'back' };
          } else {
            incomingRouteParams.current = {
              routeAction: 'pop',
              routeDirection: 'none',
              tab: currentTab.current,
            };
          }
        }
        if (!incomingRouteParams.current) {
          incomingRouteParams.current = {
            routeAction: 'push',
            routeDirection: location.state?.direction || 'forward',
            routeOptions: location.state?.routerOptions,
            tab: currentTab.current,
          };
        }
      }

      let routeInfo: RouteInfo;

      if (incomingRouteParams.current?.id) {
        routeInfo = {
          ...(incomingRouteParams.current as RouteInfo),
          lastPathname: leavingLocationInfo.pathname,
        };
        locationHistory.current.add(routeInfo);
      } else {
        const isPushed =
          incomingRouteParams.current?.routeAction === 'push' &&
          incomingRouteParams.current.routeDirection === 'forward';
        routeInfo = {
          id: generateId('routeInfo'),
          ...incomingRouteParams,
          lastPathname: leavingLocationInfo.pathname,
          pathname: location.pathname,
          search: location.search,
          params: params as any, // TODO @sean fix type of route info for params
          prevRouteLastPathname: leavingLocationInfo.lastPathname,
        };
        if (isPushed) {
          routeInfo.tab = leavingLocationInfo.tab;
          routeInfo.pushedByRoute = leavingLocationInfo.pathname;
        } else if (routeInfo.routeAction === 'pop') {
          const r = locationHistory.current.findLastLocation(routeInfo);
          routeInfo.pushedByRoute = r?.pushedByRoute;
        } else if (routeInfo.routeAction === 'push' && routeInfo.tab !== leavingLocationInfo.tab) {
          // If we are switching tabs grab the last route info for the tab and use its pushedByRoute
          const lastRoute = locationHistory.current.getCurrentRouteInfoForTab(routeInfo.tab);
          routeInfo.pushedByRoute = lastRoute?.pushedByRoute;
        } else if (routeInfo.routeAction === 'replace') {
          // Make sure to set the lastPathname, etc.. to the current route so the page transitions out
          const currentRouteInfo = locationHistory.current.current();

          /**
           * If going from /home to /child, then replacing from
           * /child to /home, we don't want the route info to
           * say that /home was pushed by /home which is not correct.
           */
          const currentPushedBy = currentRouteInfo?.pushedByRoute;
          const pushedByRoute =
            currentPushedBy !== undefined && currentPushedBy !== routeInfo.pathname
              ? currentPushedBy
              : routeInfo.pushedByRoute;

          routeInfo.lastPathname = currentRouteInfo?.pathname || routeInfo.lastPathname;
          routeInfo.prevRouteLastPathname = currentRouteInfo?.lastPathname;
          routeInfo.pushedByRoute = pushedByRoute;

          /**
           * When replacing routes we should still prefer
           * any custom direction/animation that the developer
           * has specified when navigating first instead of relying
           * on previously used directions/animations.
           */
          routeInfo.routeDirection = routeInfo.routeDirection || currentRouteInfo?.routeDirection;
          routeInfo.routeAnimation = routeInfo.routeAnimation || currentRouteInfo?.routeAnimation;
        }

        locationHistory.current.add(routeInfo);
      }
      setRouteInfo(routeInfo);
    }

    incomingRouteParams.current = null;
  };

  const handleResetTab = (tab: string, originalHref: string, originalRouteOptions: any) => {
    const routeInfo = locationHistory.current.getFirstRouteInfoForTab(tab);
    if (routeInfo) {
      const newRouteInfo = { ...routeInfo };
      newRouteInfo.pathname = originalHref;
      newRouteInfo.routeOptions = originalRouteOptions;
      incomingRouteParams.current = { ...newRouteInfo, routeAction: 'pop', routeDirection: 'back' };
      navigate(newRouteInfo.pathname + (newRouteInfo.search || ''));
    }
  };

  const handleChangeTab = (tab: string, path?: string, routeOptions?: any) => {
    if (!path) {
      return;
    }

    const routeInfo = locationHistory.current.getCurrentRouteInfoForTab(tab);
    const [pathname, search] = path.split('?');
    if (routeInfo) {
      const routeParams = {
        ...routeInfo,
        routeAction: 'push' as RouteAction,
        routeDirection: 'none' as RouterDirection,
      };
      if (routeInfo.pathname === pathname) {
        incomingRouteParams.current = {
          ...routeParams,
          routeOptions,
        };

        navigate(routeInfo.pathname + (routeInfo.search || ''));
      } else {
        incomingRouteParams.current = {
          ...routeParams,
          pathname,
          search: search ? '?' + search : undefined,
          routeOptions,
        };

        navigate(pathname + (search ? '?' + search : ''));
      }
    } else {
      handleNavigate(pathname, 'push', 'none', undefined, routeOptions, tab);
    }
  };

  const handleSetCurrentTab = (tab: string) => {
    currentTab.current = tab;
    const ri = { ...locationHistory.current.current() };
    if (ri.tab !== tab) {
      ri.tab = tab;
      locationHistory.current.update(ri);
    }
  };

  const handleNativeBack = () => {
    navigate(-1);
  };

  const handleNavigateBack = (defaultHref: string | RouteInfo = '/', routeAnimation?: AnimationBuilder) => {
    const config = getConfig();
    defaultHref = defaultHref ? defaultHref : config && config.get('backButtonDefaultHref' as any);
    const routeInfo = locationHistory.current.current();
    if (routeInfo && routeInfo.pushedByRoute) {
      const prevInfo = locationHistory.current.findLastLocation(routeInfo);
      if (prevInfo) {
        /**
         * This needs to be passed to handleNavigate
         * otherwise incomingRouteParams.routeAnimation
         * will be overridden.
         */
        const incomingAnimation = routeAnimation || routeInfo.routeAnimation;
        incomingRouteParams.current = {
          ...prevInfo,
          routeAction: 'pop',
          routeDirection: 'back',
          routeAnimation: incomingAnimation,
        };
        if (
          routeInfo.lastPathname === routeInfo.pushedByRoute ||
          /**
           * We need to exclude tab switches/tab
           * context changes here because tabbed
           * navigation is not linear, but router.back()
           * will go back in a linear fashion.
           */
          (prevInfo.pathname === routeInfo.pushedByRoute && routeInfo.tab === '' && prevInfo.tab === '')
        ) {
          navigate(-1);
        } else {
          handleNavigate(prevInfo.pathname + (prevInfo.search || ''), 'pop', 'back', incomingAnimation);
        }
      } else {
        handleNavigate(defaultHref as string, 'pop', 'back', routeAnimation);
      }
    } else {
      handleNavigate(defaultHref as string, 'pop', 'back', routeAnimation);
    }
  };

  const handleNavigate = (
    path: string,
    routeAction: RouteAction,
    routeDirection?: RouterDirection,
    routeAnimation?: AnimationBuilder,
    routeOptions?: any,
    tab?: string
  ) => {
    incomingRouteParams.current = Object.assign(incomingRouteParams.current || {}, {
      routeAction,
      routeDirection,
      routeOptions,
      routeAnimation,
      tab,
    });

    navigate(path, { replace: routeAction !== 'push' });
  };

  if (!didMountRef.current) {
    locationHistory.current.add(routeInfo);

    registerHistoryListener(handleHistoryChange);
  }

  const routeMangerContextValue: RouteManagerContextState = {
    canGoBack: () => locationHistory.current.canGoBack(),
    clearOutlet: viewStack.current.clear,
    findViewItemByPathname: viewStack.current.findViewItemByPathname,
    getChildrenToRender: viewStack.current.getChildrenToRender,
    goBack: () => handleNavigateBack(),
    createViewItem: viewStack.current.createViewItem,
    findViewItemByRouteInfo: viewStack.current.findViewItemByRouteInfo,
    findLeavingViewItemByRouteInfo: viewStack.current.findLeavingViewItemByRouteInfo,
    addViewItem: viewStack.current.add,
    unMountViewItem: viewStack.current.remove,
  };

  return (
    <RouteManagerContext.Provider value={routeMangerContextValue}>
      <NavManager
        ionRoute={IonRouteInner}
        ionRedirect={{}}
        stackManager={StackManager}
        routeInfo={routeInfo}
        onNativeBack={handleNativeBack}
        onNavigateBack={handleNavigateBack}
        onNavigate={handleNavigate}
        onSetCurrentTab={handleSetCurrentTab}
        onChangeTab={handleChangeTab}
        onResetTab={handleResetTab}
        locationHistory={locationHistory.current}
      >
        {children}
      </NavManager>
    </RouteManagerContext.Provider>
  );
};

IonRouter.displayName = 'IonRouter';

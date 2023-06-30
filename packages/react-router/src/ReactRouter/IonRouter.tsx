import type { AnimationBuilder, RouteAction, RouteInfo, RouteManagerContextState, RouterDirection } from '@ionic/react';
import { LocationHistory, NavManager, RouteManagerContext, generateId, getConfig } from '@ionic/react';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import type { Location, NavigationType } from 'react-router-dom';
import { useLocation, useNavigate, useNavigationType, useParams } from 'react-router-dom';

import { IonRouteInner } from './IonRouteInner';
import { ReactRouterViewStack } from './ReactRouterViewStack';
import StackManager from './StackManager';

export interface LocationState {
  direction?: RouterDirection;
  routerOptions?: { as?: string; unmount?: boolean };
}

function IonRouterInner(props: PropsWithChildren<any>) {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  const [currentTab, setCurrentTab] = useState<string>();
  const [incomingRouteParams, setIncomingRouteParams] = useState<Partial<RouteInfo>>({});
  const [routeInfo, setRouteInfo] = useState({
    id: generateId('routeInfo'),
    pathname: location.pathname,
    search: location.search,
  });
  const locationHistory = useRef(new LocationHistory());

  const viewStack = useRef(new ReactRouterViewStack());

  useEffect(() => {
    locationHistory.current.add(routeInfo);
  }, []);

  useEffect(() => {
    handleHistoryChange(location, navigationType);
  }, [location, navigationType]);

  const handleChangeTab = (tab: string, path?: string, routeOptions?: any) => {
    if (!path) {
      return;
    }

    const routeInfo = locationHistory.current.getCurrentRouteInfoForTab(tab);
    const [pathname, search] = path.split('?');

    if (routeInfo) {
      const routeParams = {
        ...incomingRouteParams,
        routeAction: 'push' as RouteAction,
        routeDirection: 'none' as RouterDirection,
      };
      if (routeInfo.pathname === pathname) {
        routeParams.routeOptions = routeOptions;
        setIncomingRouteParams({
          ...routeParams,
          routeOptions,
        });
        navigate(routeInfo.pathname + (routeInfo.search || ''));
      } else {
        setIncomingRouteParams({
          ...routeParams,
          pathname,
          search: search ? '?' + search : undefined,
          routeOptions,
        });
        navigate(pathname + (search ? '?' + search : ''));
      }
    } else {
      handleNavigate(pathname, 'push', 'none', undefined, routeOptions, tab);
    }
  };

  const handleHistoryChange = (location: Location, action: NavigationType) => {
    let leavingLocationInfo: RouteInfo;
    if (incomingRouteParams) {
      if (incomingRouteParams.routeAction === 'replace') {
        leavingLocationInfo = locationHistory.current.previous();
      } else {
        leavingLocationInfo = locationHistory.current.current();
      }
    } else {
      leavingLocationInfo = locationHistory.current.current();
    }

    const leavingUrl = leavingLocationInfo.pathname + leavingLocationInfo.search;
    if (leavingUrl !== location.pathname) {
      if (!incomingRouteParams) {
        if (action === 'REPLACE') {
          setIncomingRouteParams({
            routeAction: 'replace' as RouteAction,
            routeDirection: 'none' as RouterDirection,
            tab: currentTab,
          });
        }
        if (action === 'POP') {
          const currentRoute = locationHistory.current.current();
          if (currentRoute && currentRoute.pushedByRoute) {
            const prevInfo = locationHistory.current.findLastLocation(currentRoute);
            setIncomingRouteParams({
              ...prevInfo,
              routeAction: 'pop' as RouteAction,
              routeDirection: 'back' as RouterDirection,
            });
          } else {
            setIncomingRouteParams({
              routeAction: 'pop' as RouteAction,
              routeDirection: 'back' as RouterDirection,
              tab: currentTab,
            });
          }
        }
        if (!incomingRouteParams) {
          setIncomingRouteParams({
            routeAction: 'push' as RouteAction,
            routeDirection: location.state?.direction || 'forward',
            routeOptions: location.state?.routerOptions, // todo @sean review this routeOptions vs. routerOptions
            tab: currentTab,
          });
        }
      }

      let routeInfo: RouteInfo;

      if (incomingRouteParams?.id) {
        routeInfo = {
          ...(incomingRouteParams as RouteInfo),
          lastPathname: leavingLocationInfo.pathname,
        };
        locationHistory.current.add(routeInfo);
      } else {
        const isPushed = incomingRouteParams.routeAction === 'push' && incomingRouteParams.routeDirection === 'forward';

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
          routeInfo.routeDirection = currentRouteInfo?.routeDirection || routeInfo.routeDirection;
          routeInfo.routeAnimation = currentRouteInfo?.routeAnimation || routeInfo.routeAnimation;
        }
        locationHistory.current.add(routeInfo);
      }
      setRouteInfo(routeInfo);
    }

    setIncomingRouteParams({});
  };

  const handleNativeBack = () => {
    navigate(-1);
  };

  const handleNavigate = (
    path: string,
    routeAction: RouteAction,
    routeDirection?: RouterDirection,
    routeAnimation?: AnimationBuilder,
    routeOptions?: any,
    tab?: string
  ) => {
    setIncomingRouteParams({
      ...incomingRouteParams,
      routeAction,
      routeDirection,
      routeOptions,
      routeAnimation,
      tab,
    });

    navigate(path, { replace: routeAction !== 'push' });
  };

  const handleNavigateBack = (defaultHref: string | RouteInfo = '/', routeAnimation?: AnimationBuilder) => {
    const config = getConfig();

    if (!defaultHref && config) {
      // If the defaultHref wasn't passed in, then we should use the configured defaultHref.
      // Developers can set this on their IonicConfig.
      defaultHref = config.get('backButtonDefaultHref');
    }

    const routeInfo = locationHistory.current.current();
    if (routeInfo && routeInfo.pushedByRoute) {
      const prevInfo = locationHistory.current.findLastLocation(routeInfo);
      if (prevInfo) {
        setIncomingRouteParams({
          ...prevInfo,
          routeAction: 'pop' as RouteAction,
          routeDirection: 'back' as RouterDirection,
          routeAnimation: routeAnimation || routeInfo.routeAnimation,
        });
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
          handleNavigate(prevInfo.pathname + (prevInfo.search || ''), 'pop', 'back');
        }
      } else {
        handleNavigate(defaultHref as string, 'pop', 'back');
      }
    } else {
      handleNavigate(defaultHref as string, 'pop', 'back');
    }
  };

  const handleResetTab = (tab: string, originalHref: string, originalRouteOptions: any) => {
    const firstRouteForTab = locationHistory.current.getFirstRouteInfoForTab(tab);
    if (firstRouteForTab) {
      const routeInfo = {
        ...firstRouteForTab,
        pathName: originalHref,
        routeOptions: originalRouteOptions,
        routeAction: 'pop' as RouteAction,
        routeDirection: 'back' as RouterDirection,
      };
      setIncomingRouteParams(routeInfo);
      navigate(routeInfo.pathname + (routeInfo.search || ''));
    }
  };

  const handleSetCurrentTab = (tab: string) => {
    setCurrentTab(tab);
    const currentRoute = locationHistory.current.current();
    if (currentRoute && currentRoute.tab !== tab) {
      const updatedRoute = { ...currentRoute, tab };
      locationHistory.current.update(updatedRoute);
    }
  };

  const routeManagerContextValue: RouteManagerContextState = {
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
    <RouteManagerContext.Provider value={routeManagerContextValue}>
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
        {props.children}
      </NavManager>
    </RouteManagerContext.Provider>
  );
}

export const IonRouter = IonRouterInner;

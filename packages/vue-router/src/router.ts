import {
  Router,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  RouterOptions,
} from 'vue-router';
import { createLocationHistory } from './locationHistory';
import { generateId } from './utils';
import {
  ExternalNavigationOptions,
  RouteInfo,
  RouteParams
} from './types';

export const createIonRouter = (opts: RouterOptions, router: Router) => {
  const locationHistory = createLocationHistory();
  let currentRouteInfo: RouteInfo;
  let incomingRouteParams: RouteParams;

  if (typeof (document as any) !== 'undefined') {
    document.addEventListener('ionBackButton', (ev: Event) => {
      (ev as any).detail.register(0, (processNextHandler: () => void) => {
        opts.history.go(-1);
        processNextHandler();
      });
    })
  }

  //   NavigationCallback
  opts.history.listen((_: any, _x: any, info: any) => handleNavigate(info));

  //  HistoryLocation   HistoryLocation    NavigationInformation
  const handleNavigate = (info: any) => {
    incomingRouteParams = {
      routerAction: info.type,
      routerDirection: info.direction
    };
  }

  const handleHistoryChange = (to: RouteLocationNormalized) => {
    let leavingLocationInfo: RouteInfo;
    let routeInfo: RouteInfo;

    if (incomingRouteParams) {
      if (incomingRouteParams.routerAction === 'replace') {
        leavingLocationInfo = locationHistory.previous();
      } else {
        leavingLocationInfo = locationHistory.current();
      }
    } else {
      leavingLocationInfo = locationHistory.current();
    }

    if (!leavingLocationInfo) {
      leavingLocationInfo = {};
    }

    const leavingUrl = leavingLocationInfo.pathname + leavingLocationInfo.search;
    if (leavingUrl !== to.fullPath) {
      if (!incomingRouteParams) {
        incomingRouteParams = {
          routerAction: 'push',
          routerDirection: 'forward'
        };
      }

      routeInfo = {
        ...incomingRouteParams,
        id: generateId('routeInfo'),
        lastPathname: leavingLocationInfo.pathname,
        pathname: to.path,
        search: to.fullPath.split('?')[1] || '',
        params: to.params
      };

      // TODO add tabs support

      locationHistory.add(routeInfo);
    } else {
      routeInfo = leavingLocationInfo;
    }

    currentRouteInfo = routeInfo;
    incomingRouteParams = undefined;
  }

  const getCurrentRouteInfo = () => currentRouteInfo;

  const setInitialRoute = (routeInfo: RouteLocationNormalizedLoaded) => {
    const info: RouteInfo = {
      id: generateId('routeInfo'),
      pathname: routeInfo.fullPath,
      search: ''
    }

    locationHistory.add(info);
  }

  const canGoBack = (deep: number = 1) => locationHistory.canGoBack(deep);

  const setIncomingRouteParams = (params: RouteParams) => {
    incomingRouteParams = params;
  }

  const navigate = (navigationOptions: ExternalNavigationOptions) => {
    const { routerAnimation, routerDirection, routerLink } = navigationOptions;

    incomingRouteParams = {
      routerAnimation,
      routerDirection: routerDirection || 'forward',
      routerAction: 'push'
    }

    router.push(routerLink);
  }

  const getRouter = () => router;
  const getLocationHistory = () => locationHistory;

  return {
    handleHistoryChange,
    getCurrentRouteInfo,
    setInitialRoute,
    canGoBack,
    navigate,
    getRouter,
    getLocationHistory,
    setIncomingRouteParams
  }
}

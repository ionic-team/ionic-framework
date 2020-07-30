import {
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  RouterOptions,
} from 'vue-router';
import { createLocationHistory } from './locationHistory';
import { generateId } from './utils';
import {
  RouteInfo,
  RouteParams,
  TransitionCallback,
} from './types';

export const createIonRouter = (opts: RouterOptions) => {
  const locationHistory = createLocationHistory();
  let currentRouteInfo: RouteInfo;
  let incomingRouteParams: RouteParams;
  let transitionListeners: TransitionCallback[] = [];

  //   NavigationCallback
  opts.history.listen((_: any, _x: any, info: any) => handleNavigate(info));

  //  HistoryLocation   HistoryLocation    NavigationInformation
  const handleNavigate = (info: any) => {
    incomingRouteParams = {
      routeAction: info.type,
      routeDirection: info.direction
    };
  }

  const handleRegisterListener = (cb: TransitionCallback) => {
    transitionListeners.push(cb);
  }

  const handleHistoryChange = (to: RouteLocationNormalized) => {
    let leavingLocationInfo: RouteInfo;
    let routeInfo: RouteInfo;

    if (incomingRouteParams) {
      if (incomingRouteParams.routeAction === 'replace') {
        leavingLocationInfo = locationHistory.previous();
      } else {
        leavingLocationInfo = locationHistory.current();
      }
    } else {
      leavingLocationInfo = locationHistory.current();
    }

    const leavingUrl = leavingLocationInfo.pathname + leavingLocationInfo.search;
    if (leavingUrl !== to.fullPath) {
      if (!incomingRouteParams) {
        incomingRouteParams = {
          routeAction: 'push',
          routeDirection: 'forward'
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

  const handleTransition = () => {
    transitionListeners.forEach(listener => listener(currentRouteInfo!)); // TODO
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

  const canGoBack = () => locationHistory.canGoBack();

  return {
    handleHistoryChange,
    getCurrentRouteInfo,
    handleRegisterListener,
    handleTransition,
    setInitialRoute,
    canGoBack
  }
}

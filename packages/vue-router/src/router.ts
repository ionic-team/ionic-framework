import {
  Router,
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
} from 'vue-router';
import { createLocationHistory } from './locationHistory';
import { generateId } from './utils';
import {
  ExternalNavigationOptions,
  RouteInfo,
  RouteParams,
  IonicVueRouterOptions
} from './types';

export const createIonRouter = (opts: IonicVueRouterOptions, router: Router) => {
  const tabsPrefix = opts.tabsPrefix || '/tabs';
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

  const getTab = (path: string): string | undefined => {
    const tabs = path.split(tabsPrefix);
    if (tabs.length === 1) return undefined;

    return tabs[1].split('/')[1];
  }

  const isTabSwitch = (to: string, from: string): boolean => {
    const toTab = getTab(to);
    const fromTab = getTab(from);

    return fromTab !== undefined && toTab !== undefined && fromTab !== toTab
  }

  //  HistoryLocation   HistoryLocation    NavigationInformation
  const handleNavigate = (info: any) => {
    incomingRouteParams = {
      routerAction: info.type,
      routerDirection: info.direction
    };
  }

  const handleHistoryChange = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
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

      const tabSwitch = isTabSwitch(to.fullPath, from.fullPath);
      if (tabSwitch) {
        incomingRouteParams.routerDirection = 'root';
      }

      routeInfo = {
        ...incomingRouteParams,
        id: generateId('routeInfo'),
        lastPathname: leavingLocationInfo.pathname,
        pathname: to.path,
        search: to.fullPath.split('?')[1] || '',
        params: to.params,
        tab: getTab(to.fullPath),
        previousTab: getTab(from.fullPath),
        tabSwitch
      };

      if (incomingRouteParams.routerAction === 'pop' && !tabSwitch) {
        locationHistory.pop(routeInfo);
      } else {
        locationHistory.add(routeInfo);
      }
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

  const getLocationHistory = () => locationHistory;

  const resetTab = (tab: string, originalHref: string) => {
    const routeInfo = locationHistory.getFirstRouteInfoForTab(tab);
    if (routeInfo) {
      const newRouteInfo = { ...routeInfo };
      newRouteInfo.pathname = originalHref;
      incomingRouteParams = { ...newRouteInfo, routerAction: 'pop', routerDirection: 'back' };
      router.push(newRouteInfo.pathname + (newRouteInfo.search || ''));
    }
  }

  const changeTab = (tab: string, path: string) => {
    const routeInfo = locationHistory.getCurrentRouteInfoForTab(tab);
    const [pathname, search] = path.split('?');
    if (routeInfo) {
      incomingRouteParams = { ...routeInfo, routerAction: 'push', routerDirection: 'none' };
      if (routeInfo.pathname === pathname) {
        router.push(routeInfo.pathname + (routeInfo.search || ''))
      } else {
        router.push(pathname + (search ? '?' + search : ''));
      }
    } else {
      navigate({
        routerLink: pathname,
        routerDirection: 'none'
      })
    }
  }

  return {
    handleHistoryChange,
    getCurrentRouteInfo,
    setInitialRoute,
    canGoBack,
    navigate,
    getLocationHistory,
    setIncomingRouteParams,
    resetTab,
    changeTab
  }
}

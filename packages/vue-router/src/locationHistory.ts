import { RouteInfo } from './types';

export const createLocationHistory = () => {
  const locationHistory: RouteInfo[] = [];
  const tabsHistory: { [k: string]: RouteInfo[] } = {};

  const add = (routeInfo: RouteInfo) => {
    switch (routeInfo.routerAction) {
      case "replace":
      replaceRoute(routeInfo);
      break;
      default:
      addRoute(routeInfo);
      break;
    }

    if (routeInfo.routerDirection === 'root') {
      clearHistory(routeInfo);
      addRoute(routeInfo);
    }
  }

  const replaceRoute = (routeInfo: RouteInfo) => {
    pop(routeInfo);
    addRoute(routeInfo);
  }

  const pop = (routeInfo: RouteInfo) => {
    locationHistory.pop();
    const { tab } = routeInfo;
    if (tab) {
      if (tabsHistory[tab]) {
        tabsHistory[tab].pop();
      }
    }
  }
  const addRoute = (routeInfo: RouteInfo) => {
    locationHistory.push(routeInfo);
    const { tab } = routeInfo;
    if (tab) {
      if (tabsHistory[tab]) {
        tabsHistory[tab].push(routeInfo)
      } else {
        tabsHistory[tab] = [routeInfo];
      }
    }
  }

  const clearHistory = (routeInfo: RouteInfo) => {
    locationHistory.length = 0;
    const { tab } = routeInfo;
    if (tab) {
      tabsHistory[tab] = [];
    }
  }
  const getTabsHistory = (tab: string) => tabsHistory[tab];
  const previous = () => locationHistory[locationHistory.length - 2] || current();
  const current = () => locationHistory[locationHistory.length - 1];
  const canGoBack = (deep: number = 1) => locationHistory.length > deep;

  const getFirstRouteInfoForTab = (tab: string): RouteInfo | undefined => {
    const tabHistory = getTabsHistory(tab);
    if (tabHistory) {
      return tabHistory[0];
    }
    return undefined;
  }

  const getCurrentRouteInfoForTab = (tab: string): RouteInfo | undefined => {
    const tabHistory = getTabsHistory(tab);
    if (tabHistory) {
      return tabHistory[tabHistory.length - 1];
    }
    return undefined;
  }

  return {
    current,
    previous,
    add,
    pop,
    canGoBack,
    getTabsHistory,
    getFirstRouteInfoForTab,
    getCurrentRouteInfoForTab
  }
}

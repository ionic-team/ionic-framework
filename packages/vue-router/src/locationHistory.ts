import { RouteInfo } from './types';

export const createLocationHistory = () => {
  const locationHistory: RouteInfo[] = [];

  const add = (routeInfo: RouteInfo) => {
    switch (routeInfo.routeAction) {
      case "pop":
      popRoute(routeInfo);
      break;
      case "replace":
      replaceRoute(routeInfo);
      break;
      default:
      addRoute(routeInfo);
      break;
    }

    if (routeInfo.routeDirection === 'root') {
      clearHistory();
      addRoute(routeInfo);
    }
  }

  const addRoute = (routeInfo: RouteInfo) => {
    // TODO add tabs support

    locationHistory.push(routeInfo);
  }

  const popRoute = (routeInfo: RouteInfo) => {
    // TODO add tabs support

    let lastRoute = locationHistory[locationHistory.length - 1];
    while (lastRoute && lastRoute.id !== routeInfo.id) {
      locationHistory.pop();
      lastRoute = locationHistory[locationHistory.length - 1];
    }

    replaceRoute(routeInfo);
  }

  const replaceRoute = (routeInfo: RouteInfo) => {
    // TODO add tabs support

    locationHistory.pop();
    addRoute(routeInfo);
  }

  const clearHistory = () => {
    // TODO add tabs support
    locationHistory.length = 0;
  }

  const previous = () => {
    return locationHistory[locationHistory.length - 2] || current();
  }

  const current = () => {
    return locationHistory[locationHistory.length - 1];
  }

  const canGoBack = (deep: number = 1) => {
    return locationHistory.length > deep;
  }

  return {
    current,
    previous,
    add,
    canGoBack
  }
}

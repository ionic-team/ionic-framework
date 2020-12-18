import { RouteInfo } from '../models/RouteInfo';

// const RESTRICT_SIZE = 100;

export class LocationHistory {
  private locationHistory: RouteInfo[] = [];
  private tabHistory: {
    [key: string]: RouteInfo[];
  } = {};

  add(routeInfo: RouteInfo) {
    if (routeInfo.routeAction === 'push' || routeInfo.routeAction == null) {
      this._add(routeInfo);
    } else if (routeInfo.routeAction === 'pop') {
      this._pop(routeInfo);
    } else if (routeInfo.routeAction === 'replace') {
      this._replace(routeInfo);
    }

    if (routeInfo.routeDirection === 'root') {
      this._clear();
      this._add(routeInfo);
    }
  }

  clearTabStack(tab: string) {
    const routeInfos = this._getRouteInfosByKey(tab);
    if (routeInfos) {
      routeInfos.forEach((ri) => {
        this.locationHistory = this.locationHistory.filter((x) => x.id !== ri.id);
      });
      this.tabHistory[tab] = [];
    }
  }

  update(routeInfo: RouteInfo) {
    const locationIndex = this.locationHistory.findIndex((x) => x.id === routeInfo.id);
    if (locationIndex > -1) {
      this.locationHistory.splice(locationIndex, 1, routeInfo);
    }
    const tabArray = this.tabHistory[routeInfo.tab || ''];
    if (tabArray) {
      const tabIndex = tabArray.findIndex((x) => x.id === routeInfo.id);
      if (tabIndex > -1) {
        tabArray.splice(tabIndex, 1, routeInfo);
      } else {
        tabArray.push(routeInfo);
      }
    } else if (routeInfo.tab) {
      this.tabHistory[routeInfo.tab] = [routeInfo];
    }
  }

  private _add(routeInfo: RouteInfo) {
    const routeInfos = this._getRouteInfosByKey(routeInfo.tab);
    if (routeInfos) {
      // If the latest routeInfo is the same (going back and forth between tabs), replace it
      if (this._areRoutesEqual(routeInfos[routeInfos.length - 1], routeInfo)) {
        routeInfos.pop();
      }
      routeInfos.push(routeInfo);
    }
    this.locationHistory.push(routeInfo);
  }

  private _areRoutesEqual(route1?: RouteInfo, route2?: RouteInfo) {
    if(!route1 || !route2) {
      return false;
    }
    return route1.pathname === route2.pathname && route1.search === route2.search;
  }

  private _pop(routeInfo: RouteInfo) {
    const routeInfos = this._getRouteInfosByKey(routeInfo.tab);

    if (routeInfos) {
      // Pop the previous route
      routeInfos.pop();
      // Replace the current route with an updated version
      routeInfos.pop();
      routeInfos.push(routeInfo);
    }

    // Pop the previous route
    this.locationHistory.pop();
    // Replace the current route with an updated version
    this.locationHistory.pop();
    this.locationHistory.push(routeInfo);
  }

  private _replace(routeInfo: RouteInfo) {
    const routeInfos = this._getRouteInfosByKey(routeInfo.tab);
    routeInfos && routeInfos.pop();
    this.locationHistory.pop();
    this._add(routeInfo);
  }

  private _clear() {
    const keys = Object.keys(this.tabHistory);
    keys.forEach((k) => (this.tabHistory[k] = []));
    this.locationHistory = [];
  }

  private _getRouteInfosByKey(key?: string) {
    let routeInfos: RouteInfo[] | undefined;
    if (key) {
      routeInfos = this.tabHistory[key];
      if (!routeInfos) {
        routeInfos = this.tabHistory[key] = [];
      }
    }
    return routeInfos;
  }

  getFirstRouteInfoForTab(tab: string) {
    const routeInfos = this._getRouteInfosByKey(tab);
    if (routeInfos) {
      return routeInfos[0];
    }
    return undefined;
  }

  getCurrentRouteInfoForTab(tab?: string) {
    const routeInfos = this._getRouteInfosByKey(tab);
    if (routeInfos) {
      return routeInfos[routeInfos.length - 1];
    }
    return undefined;
  }

  findLastLocation(routeInfo: RouteInfo) {
    const routeInfos = this._getRouteInfosByKey(routeInfo.tab);
    if (routeInfos) {
      for (let i = routeInfos.length - 2; i >= 0; i--) {
        const ri = routeInfos[i];
        if (ri) {
          if (ri.pathname === routeInfo.pushedByRoute) {
            return ri;
          }
        }
      }
    }
    for (let i = this.locationHistory.length - 2; i >= 0; i--) {
      const ri = this.locationHistory[i];
      if (ri) {
        if (ri.pathname === routeInfo.pushedByRoute) {
          return ri;
        }
      }
    }
    return undefined;
  }

  previous() {
    return (
      this.locationHistory[this.locationHistory.length - 2] ||
      this.locationHistory[this.locationHistory.length - 1]
    );
  }

  current() {
    return this.locationHistory[this.locationHistory.length - 1];
  }

  canGoBack() {
    return this.locationHistory.length > 1;
  }
}

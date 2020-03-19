import { RouteInfo } from '../models/RouteInfo';

// const RESTRICT_SIZE = 100;

export class LocationHistory {
  private locationHistory: RouteInfo[] = [];
  private tabHistory: {
    [key: string]: RouteInfo[];
  } = { main: [] };

  updateHistory(routeInfo: RouteInfo) {

    if (routeInfo.routeAction === 'push' || routeInfo.routeAction == null) {
      this.add(routeInfo);
    } else if (routeInfo.routeAction === 'pop') {
      this.pop(routeInfo);
    } else if (routeInfo.routeAction === 'replace') {
      this.replace(routeInfo);
    }

    if (routeInfo.routeDirection === 'root') {
      this.clear();
      this.add(routeInfo);
    }
  }

  private add(routeInfo: RouteInfo) {
    const routeInfos = this.getRouteInfosByKey(routeInfo.tab);
    routeInfos.push(routeInfo);
    this.locationHistory.push(routeInfo);

    // this.locationHistory.push(routeInfo);
    // if (this.locationHistory.length > RESTRICT_SIZE) {
    //   this.locationHistory.splice(0, 10);
    // }
  }

  private pop(routeInfo: RouteInfo) {
    const routeInfos = this.getRouteInfosByKey(routeInfo.tab);
    // Pop all routes until we are back
    let ri = routeInfos[routeInfos.length - 1];
    while (ri && !areRouteInfosEqual(ri, routeInfo)) {
      routeInfos.pop();
      ri = routeInfos[routeInfos.length - 1];
    }
    if (routeInfos.length === 0) {
      routeInfos.push(routeInfo);
    }
    ri = this.locationHistory[this.locationHistory.length - 1];
    while (ri && !areRouteInfosEqual(ri, routeInfo)) {
      this.locationHistory.pop();
      ri = this.locationHistory[this.locationHistory.length - 1];
    }
    if (this.locationHistory.length === 0) {
      this.locationHistory.push(routeInfo);
    }
  }

  private replace(routeInfo: RouteInfo) {
    const routeInfos = this.getRouteInfosByKey(routeInfo.tab);
    routeInfos.pop();
    this.locationHistory.pop();
    this.add(routeInfo);
  }

  private clear() {
    const keys = Object.keys(this.tabHistory);
    keys.forEach(k => this.tabHistory[k] = []);
    this.locationHistory = [];
  }

  private getRouteInfosByKey(key?: string) {
    let routeInfos: RouteInfo[];
    if (key) {
      routeInfos = this.tabHistory[key];
      if (!routeInfos) {
        routeInfos = this.tabHistory[key] = [];
      }
    } else {
      routeInfos = this.tabHistory.main;
    }
    return routeInfos;
  }

  getCurrentRouteInfoForTab(tab?: string) {
    const routeInfos = this.getRouteInfosByKey(tab);
    if (routeInfos) {
      return routeInfos[routeInfos.length - 1];
    }
    return undefined;
  }

  findLastLocation(routeInfo: RouteInfo) {
    const routeInfos = this.getRouteInfosByKey(routeInfo.tab);
    for (let i = routeInfos.length - 2; i >= 0; i--) {
      const ri = routeInfos[i];
      if (ri) {
        if (ri.currentRoute === routeInfo.pushedByRoute) {
          return ri;
        }
      }
    }
    for (let i = this.locationHistory.length - 2; i >= 0; i--) {
      const ri = this.locationHistory[i];
      if (ri) {
        if (ri.currentRoute === routeInfo.pushedByRoute) {
          return ri;
        }
      }
    }
    return undefined;
  }

  previous(routeInfo: RouteInfo) {
    const routeInfos = this.getRouteInfosByKey(routeInfo.tab);
    return routeInfos[routeInfos.length - 2];
  }

  current() {
    // const routeInfos = this.getRouteInfosByKey(routeInfo.tab);
    // const ri = routeInfos[routeInfos.length - 1];
    // if(ri) {
    //   return ri;
    // }
    return this.locationHistory[this.locationHistory.length - 1];
  }
}

function areRouteInfosEqual(r1: RouteInfo, r2: RouteInfo) {
  if (r1.currentRoute.toLowerCase() === r2.currentRoute.toLowerCase()) {
    if (JSON.stringify(r1.routeOptions || '').toLowerCase() === JSON.stringify(r2.routeOptions || '').toLowerCase()) {
      return true;
    }
  }
  return false;
}

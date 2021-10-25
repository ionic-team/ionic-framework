import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class IonicRouteStrategy implements RouteReuseStrategy {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shouldDetach(_route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shouldAttach(_route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  store(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _route: ActivatedRouteSnapshot,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _detachedTree: DetachedRouteHandle
  ): void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  retrieve(_route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    if (future.routeConfig !== curr.routeConfig) {
      return false;
    }

    // checking router params
    const futureParams = future.params;
    const currentParams = curr.params;
    const keysA = Object.keys(futureParams);
    const keysB = Object.keys(currentParams);

    if (keysA.length !== keysB.length) {
      return false;
    }

    // Test for A's keys different from B.
    for (const key of keysA) {
      if (currentParams[key] !== futureParams[key]) {
        return false;
      }
    }
    return true;
  }
}

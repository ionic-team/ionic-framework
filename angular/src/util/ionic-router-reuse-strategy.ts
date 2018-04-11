import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import { deepEqual, objectValues } from './util';

export class IonicRouteStrategy implements RouteReuseStrategy {

  shouldDetach(_route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  // tslint:disable-next-line
  store(_route: ActivatedRouteSnapshot, _detachedTree: DetachedRouteHandle): void { }

  shouldAttach(_route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  retrieve(_route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    if (objectValues(future.params) && objectValues(curr.params)) {
      return deepEqual(future.params, curr.params);
    } else {
      return future.routeConfig === curr.routeConfig;
    }
  }
}

import {
  DetachedRouteHandle
} from '@angular/router';

export class IonicRouteReuseStrategy {
  shouldReuseRoute(): boolean {
    return false;
  }

  shouldDetach(): boolean {
    return false;
  }

  store(): void {
  }

  shouldAttach(): boolean {
    return false;
  }

  retrieve(): DetachedRouteHandle | null {
    return null;
  }
}

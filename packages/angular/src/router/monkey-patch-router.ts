import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  RouterState,
  UrlTree
} from '@angular/router';

import { Observable } from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

import { AsyncActivateRoutes } from './async-activated-routes';

export function monkeyPatchRouter(router: any) {
  router.activateRoutes = (state: Observable<{appliedUrl: string, state: RouterState, shouldActivate: boolean}>, storedState: RouterState,
    storedUrl: UrlTree, id: number, url: UrlTree, rawUrl: UrlTree, skipLocationChange: boolean, replaceUrl: boolean, resolvePromise: any, rejectPromise: any) => {

      // applied the new router state
  // this operation has side effects
  let navigationIsSuccessful: boolean;

  const routes: AsyncActivateRoutes[] = [];
  state
    .forEach(({appliedUrl, state, shouldActivate}: any) => {
      if (!shouldActivate || id !== router.navigationId) {
        navigationIsSuccessful = false;
        return;
      }

      router.currentUrlTree = appliedUrl;
      router.rawUrlTree = router.urlHandlingStrategy.merge(router.currentUrlTree, rawUrl);

      (router as{routerState: RouterState}).routerState = state;

      if (!skipLocationChange) {
        const path = router.urlSerializer.serialize(router.rawUrlTree);
        if (router.location.isCurrentPathEqualTo(path) || replaceUrl) {
          router.location.replaceState(path, '');
        } else {
          router.location.go(path, '');
        }
      }

      routes.push(new AsyncActivateRoutes(router.routeReuseStrategy, state, storedState, (evt: Event) => router.triggerEvent(evt)));


    })
    .then(
      () => {
        const promises = routes.map(activatedRoute => activatedRoute.activate(router.rootContexts));
        return Promise.all(promises)
          .then(
            () => {
              navigationIsSuccessful = true;
            }
          );
      }
    )
    .then(
        () => {
          if (navigationIsSuccessful) {
            router.navigated = true;
            router.lastSuccessfulId = id;
            (router.events as Subject<Event>)
                .next(new NavigationEnd(
                    id, router.serializeUrl(url), router.serializeUrl(router.currentUrlTree)));
            resolvePromise(true);
          } else {
            router.resetUrlToCurrentUrlTree();
            (router.events as Subject<Event>)
                .next(new NavigationCancel(id, router.serializeUrl(url), ''));
            resolvePromise(false);
          }
        },
        (e: any) => {
          if (isNavigationCancelingError(e)) {
            router.navigated = true;
            router.resetStateAndUrl(storedState, storedUrl, rawUrl);
            (router.events as Subject<Event>)
                .next(new NavigationCancel(id, router.serializeUrl(url), e.message));

            resolvePromise(false);
          } else {
            router.resetStateAndUrl(storedState, storedUrl, rawUrl);
            (router.events as Subject<Event>)
                .next(new NavigationError(id, router.serializeUrl(url), e));
            try {
              resolvePromise(router.errorHandler(e));
            } catch (ee) {
              rejectPromise(ee);
            }
          }
        });

  };
}

function isNavigationCancelingError(error: any) {
  return error && (/** @type {?} */ (error))[NAVIGATION_CANCELING_ERROR];
}

const NAVIGATION_CANCELING_ERROR = 'ngNavigationCancelingError';

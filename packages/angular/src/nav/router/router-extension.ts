
import {
  Event,
  GuardsCheckEnd,
  GuardsCheckStart,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  PreActivation,
  ResolveEnd,
  ResolveStart,
  Router,
  RouterState,
  RouterStateSnapshot,
  RoutesRecognized,
  UrlTree,
  applyRedirects,
  createRouterState,
  isNavigationCancelingError,
  recognize
} from '@danbucholtz/ng-router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { of } from 'rxjs/observable/of';
import { concatMap } from 'rxjs/operator/concatMap';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';

import { AsyncActivateRoutes } from './async-activated-routes';


export class ExtendedRouter extends Router {

  protected runNavigate(
    url: UrlTree, rawUrl: UrlTree, skipLocationChange: boolean, replaceUrl: boolean, id: number,
    precreatedState: RouterStateSnapshot|null): Promise<boolean> {
  if (id !== this.navigationId) {
    (this.events as Subject<Event>)
        .next(new NavigationCancel(
            id, this.serializeUrl(url),
            `Navigation ID ${id} is not equal to the current navigation id ${this.navigationId}`));
    return Promise.resolve(false);
  }

  return new Promise((resolvePromise, rejectPromise) => {
    // create an observable of the url and route state snapshot
    // this operation do not result in any side effects
    let urlAndSnapshot$: Observable<{appliedUrl: UrlTree, snapshot: RouterStateSnapshot}>;
    if (!precreatedState) {
      const moduleInjector = this.ngModule.injector;
      const redirectsApplied$ =
          applyRedirects(moduleInjector, this.configLoader, this.urlSerializer, url, this.config);

      urlAndSnapshot$ = mergeMap.call(redirectsApplied$, (appliedUrl: UrlTree) => {
        return map.call(
            recognize(
                this.rootComponentType, this.config, appliedUrl, this.serializeUrl(appliedUrl),
                this.paramsInheritanceStrategy),
            (snapshot: any) => {

              (this.events as Subject<Event>)
                  .next(new RoutesRecognized(
                      id, this.serializeUrl(url), this.serializeUrl(appliedUrl), snapshot));

              return {appliedUrl, snapshot};
            });
      });
    } else {
      urlAndSnapshot$ = of ({appliedUrl: url, snapshot: precreatedState});
    }

    const beforePreactivationDone$ = mergeMap.call(
        urlAndSnapshot$, (p: {appliedUrl: string, snapshot: RouterStateSnapshot}) => {
          return map.call(this.hooks.beforePreactivation(p.snapshot), () => p);
        });

    // run preactivation: guards and data resolvers
    let preActivation: PreActivation;

    const preactivationSetup$ = map.call(
        beforePreactivationDone$,
        ({appliedUrl, snapshot}: {appliedUrl: string, snapshot: RouterStateSnapshot}) => {
          const moduleInjector = this.ngModule.injector;
          preActivation = new PreActivation(
              snapshot, this.routerState.snapshot, moduleInjector,
              (evt: Event) => this.triggerEvent(evt));
          preActivation.initialize(this.rootContexts);
          return {appliedUrl, snapshot};
        });

    const preactivationCheckGuards$ = mergeMap.call(
        preactivationSetup$,
        ({appliedUrl, snapshot}: {appliedUrl: string, snapshot: RouterStateSnapshot}) => {
          if (this.navigationId !== id) return of (false);

          this.triggerEvent(
              new GuardsCheckStart(id, this.serializeUrl(url), appliedUrl, snapshot));

          return map.call(preActivation.checkGuards(), (shouldActivate: boolean) => {
            this.triggerEvent(new GuardsCheckEnd(
                id, this.serializeUrl(url), appliedUrl, snapshot, shouldActivate));
            return {appliedUrl: appliedUrl, snapshot: snapshot, shouldActivate: shouldActivate};
          });
        });

    const preactivationResolveData$ = mergeMap.call(
        preactivationCheckGuards$,
        (p: {appliedUrl: string, snapshot: RouterStateSnapshot, shouldActivate: boolean}) => {
          if (this.navigationId !== id) return of (false);

          if (p.shouldActivate && preActivation.isActivating()) {
            this.triggerEvent(
                new ResolveStart(id, this.serializeUrl(url), p.appliedUrl, p.snapshot));
            return map.call(preActivation.resolveData(this.paramsInheritanceStrategy), () => {
              this.triggerEvent(
                  new ResolveEnd(id, this.serializeUrl(url), p.appliedUrl, p.snapshot));
              return p;
            });
          } else {
            return of (p);
          }
        });

    const preactivationDone$ = mergeMap.call(preactivationResolveData$, (p: any) => {
      return map.call(this.hooks.afterPreactivation(p.snapshot), () => p);
    });


    // create router state
    // this operation has side effects => route state is being affected
    const routerState$ =
        map.call(preactivationDone$, ({appliedUrl, snapshot, shouldActivate}: any) => {
          if (shouldActivate) {
            const state = createRouterState(this.routeReuseStrategy, snapshot, this.routerState);
            return {appliedUrl, state, shouldActivate};
          } else {
            return {appliedUrl, state: null, shouldActivate};
          }
        });


    // applied the new router state
    // this operation has side effects
    let navigationIsSuccessful = false;
    const storedState = this.routerState;
    const storedUrl = this.currentUrlTree;

    const activatedRoutes: AsyncActivateRoutes[] = [];

    routerState$
        .forEach(({appliedUrl, state, shouldActivate}: any) => {
          if (!shouldActivate || id !== this.navigationId) {
            navigationIsSuccessful = false;
            return;
          }

          this.currentUrlTree = appliedUrl;
          this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, rawUrl);

          (this as{routerState: RouterState}).routerState = state;

          if (!skipLocationChange) {
            const path = this.urlSerializer.serialize(this.rawUrlTree);
            if (this.location.isCurrentPathEqualTo(path) || replaceUrl) {
              // this.location.replaceState(path, '', {navigationId: id});
              this.location.replaceState(path, '');
            } else {
              // this.location.go(path, '', {navigationId: id});
              this.location.go(path, '');
            }
          }

          activatedRoutes.push(new AsyncActivateRoutes(this.routeReuseStrategy, state, storedState, (evt: Event) => this.triggerEvent(evt)))
        })
        .then(() => {
          const promises = activatedRoutes.map(activatedRoute => activatedRoute.activate(this.rootContexts));
          return Promise.all(promises)
            .then(
              () => {
                navigationIsSuccessful = true;
              }
            );
        })
        .then(
            () => {
              if (navigationIsSuccessful) {
                this.navigated = true;
                this.lastSuccessfulId = id;
                (this.events as Subject<Event>)
                    .next(new NavigationEnd(
                        id, this.serializeUrl(url), this.serializeUrl(this.currentUrlTree)));
                resolvePromise(true);
              } else {
                this.resetUrlToCurrentUrlTree();
                (this.events as Subject<Event>)
                    .next(new NavigationCancel(id, this.serializeUrl(url), ''));
                resolvePromise(false);
              }
            },
            (e: any) => {
              if (isNavigationCancelingError(e)) {
                this.navigated = true;
                this.resetStateAndUrl(storedState, storedUrl, rawUrl);
                (this.events as Subject<Event>)
                    .next(new NavigationCancel(id, this.serializeUrl(url), e.message));

                resolvePromise(false);
              } else {
                this.resetStateAndUrl(storedState, storedUrl, rawUrl);
                (this.events as Subject<Event>)
                    .next(new NavigationError(id, this.serializeUrl(url), e));
                try {
                  resolvePromise(this.errorHandler(e));
                } catch (ee) {
                  rejectPromise(ee);
                }
              }
            });
  });
}

  triggerEvent(e: Event): void { ((this.events as any)as Subject<Event>).next(e); }
}
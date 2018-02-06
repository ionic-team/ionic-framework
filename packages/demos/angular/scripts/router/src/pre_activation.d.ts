/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Event } from './events';
import { ChildrenOutletContexts } from './router_outlet_context';
import { RouterStateSnapshot } from './router_state';
/**
 * This class bundles the actions involved in preactivation of a route.
 */
export declare class PreActivation {
    private future;
    private curr;
    private moduleInjector;
    private forwardEvent;
    private canActivateChecks;
    private canDeactivateChecks;
    constructor(future: RouterStateSnapshot, curr: RouterStateSnapshot, moduleInjector: Injector, forwardEvent?: ((evt: Event) => void) | undefined);
    initialize(parentContexts: ChildrenOutletContexts): void;
    checkGuards(): Observable<boolean>;
    resolveData(paramsInheritanceStrategy: 'emptyOnly' | 'always'): Observable<any>;
    isDeactivating(): boolean;
    isActivating(): boolean;
    /**
     * Iterates over child routes and calls recursive `setupRouteGuards` to get `this` instance in
     * proper state to run `checkGuards()` method.
     */
    private setupChildRouteGuards(futureNode, currNode, contexts, futurePath);
    /**
     * Iterates over child routes and calls recursive `setupRouteGuards` to get `this` instance in
     * proper state to run `checkGuards()` method.
     */
    private setupRouteGuards(futureNode, currNode, parentContexts, futurePath);
    private shouldRunGuardsAndResolvers(curr, future, mode);
    private deactivateRouteAndItsChildren(route, context);
    private runCanDeactivateChecks();
    private runCanActivateChecks();
    /**
     * This should fire off `ActivationStart` events for each route being activated at this
     * level.
     * In other words, if you're activating `a` and `b` below, `path` will contain the
     * `ActivatedRouteSnapshot`s for both and we will fire `ActivationStart` for both. Always
     * return
     * `true` so checks continue to run.
     */
    private fireActivationStart(snapshot);
    /**
     * This should fire off `ChildActivationStart` events for each route being activated at this
     * level.
     * In other words, if you're activating `a` and `b` below, `path` will contain the
     * `ActivatedRouteSnapshot`s for both and we will fire `ChildActivationStart` for both. Always
     * return
     * `true` so checks continue to run.
     */
    private fireChildActivationStart(snapshot);
    private runCanActivate(future);
    private runCanActivateChild(path);
    private extractCanActivateChild(p);
    private runCanDeactivate(component, curr);
    private runResolve(future, paramsInheritanceStrategy);
    private resolveNode(resolve, future);
    private getResolver(injectionToken, future);
    private getToken(token, snapshot);
}

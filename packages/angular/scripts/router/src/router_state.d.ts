/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Type } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Data, Route } from './config';
import { ParamMap, Params } from './shared';
import { UrlSegment, UrlTree } from './url_tree';
import { Tree } from './utils/tree';
/**
 * @whatItDoes Represents the state of the router.
 *
 * @howToUse
 *
 * ```
 * @Component({templateUrl:'template.html'})
 * class MyComponent {
 *   constructor(router: Router) {
 *     const state: RouterState = router.routerState;
 *     const root: ActivatedRoute = state.root;
 *     const child = root.firstChild;
 *     const id: Observable<string> = child.params.map(p => p.id);
 *     //...
 *   }
 * }
 * ```
 *
 * @description
 * RouterState is a tree of activated routes. Every node in this tree knows about the "consumed" URL
 * segments, the extracted parameters, and the resolved data.
 *
 * See {@link ActivatedRoute} for more information.
 *
 * @stable
 */
export declare class RouterState extends Tree<ActivatedRoute> {
    /** The current snapshot of the router state */
    snapshot: RouterStateSnapshot;
    toString(): string;
}
export declare function createEmptyState(urlTree: UrlTree, rootComponent: Type<any> | null): RouterState;
export declare function createEmptyStateSnapshot(urlTree: UrlTree, rootComponent: Type<any> | null): RouterStateSnapshot;
/**
 * @whatItDoes Contains the information about a route associated with a component loaded in an
 * outlet.
 * An `ActivatedRoute` can also be used to traverse the router state tree.
 *
 * @howToUse
 *
 * ```
 * @Component({...})
 * class MyComponent {
 *   constructor(route: ActivatedRoute) {
 *     const id: Observable<string> = route.params.map(p => p.id);
 *     const url: Observable<string> = route.url.map(segments => segments.join(''));
 *     // route.data includes both `data` and `resolve`
 *     const user = route.data.map(d => d.user);
 *   }
 * }
 * ```
 *
 * @stable
 */
export declare class ActivatedRoute {
    /** An observable of the URL segments matched by this route */
    url: Observable<UrlSegment[]>;
    /** An observable of the matrix parameters scoped to this route */
    params: Observable<Params>;
    /** An observable of the query parameters shared by all the routes */
    queryParams: Observable<Params>;
    /** An observable of the URL fragment shared by all the routes */
    fragment: Observable<string>;
    /** An observable of the static and resolved data of this route. */
    data: Observable<Data>;
    /** The outlet name of the route. It's a constant */
    outlet: string;
    /** The component of the route. It's a constant */
    component: Type<any> | string | null;
    /** The current snapshot of this route */
    snapshot: ActivatedRouteSnapshot;
    /** The configuration used to match this route */
    readonly routeConfig: Route | null;
    /** The root of the router state */
    readonly root: ActivatedRoute;
    /** The parent of this route in the router state tree */
    readonly parent: ActivatedRoute | null;
    /** The first child of this route in the router state tree */
    readonly firstChild: ActivatedRoute | null;
    /** The children of this route in the router state tree */
    readonly children: ActivatedRoute[];
    /** The path from the root of the router state tree to this route */
    readonly pathFromRoot: ActivatedRoute[];
    readonly paramMap: Observable<ParamMap>;
    readonly queryParamMap: Observable<ParamMap>;
    toString(): string;
}
export declare type ParamsInheritanceStrategy = 'emptyOnly' | 'always';
/**
 * @whatItDoes Contains the information about a route associated with a component loaded in an
 * outlet
 * at a particular moment in time. ActivatedRouteSnapshot can also be used to traverse the router
 * state tree.
 *
 * @howToUse
 *
 * ```
 * @Component({templateUrl:'./my-component.html'})
 * class MyComponent {
 *   constructor(route: ActivatedRoute) {
 *     const id: string = route.snapshot.params.id;
 *     const url: string = route.snapshot.url.join('');
 *     const user = route.snapshot.data.user;
 *   }
 * }
 * ```
 *
 * @stable
 */
export declare class ActivatedRouteSnapshot {
    /** The URL segments matched by this route */
    url: UrlSegment[];
    /** The matrix parameters scoped to this route */
    params: Params;
    /** The query parameters shared by all the routes */
    queryParams: Params;
    /** The URL fragment shared by all the routes */
    fragment: string;
    /** The static and resolved data of this route */
    data: Data;
    /** The outlet name of the route */
    outlet: string;
    /** The component of the route */
    component: Type<any> | string | null;
    /** The configuration used to match this route **/
    readonly routeConfig: Route | null;
    /** The root of the router state */
    readonly root: ActivatedRouteSnapshot;
    /** The parent of this route in the router state tree */
    readonly parent: ActivatedRouteSnapshot | null;
    /** The first child of this route in the router state tree */
    readonly firstChild: ActivatedRouteSnapshot | null;
    /** The children of this route in the router state tree */
    readonly children: ActivatedRouteSnapshot[];
    /** The path from the root of the router state tree to this route */
    readonly pathFromRoot: ActivatedRouteSnapshot[];
    readonly paramMap: ParamMap;
    readonly queryParamMap: ParamMap;
    toString(): string;
}
/**
 * @whatItDoes Represents the state of the router at a moment in time.
 *
 * @howToUse
 *
 * ```
 * @Component({templateUrl:'template.html'})
 * class MyComponent {
 *   constructor(router: Router) {
 *     const state: RouterState = router.routerState;
 *     const snapshot: RouterStateSnapshot = state.snapshot;
 *     const root: ActivatedRouteSnapshot = snapshot.root;
 *     const child = root.firstChild;
 *     const id: Observable<string> = child.params.map(p => p.id);
 *     //...
 *   }
 * }
 * ```
 *
 * @description
 * RouterStateSnapshot is a tree of activated route snapshots. Every node in this tree knows about
 * the "consumed" URL segments, the extracted parameters, and the resolved data.
 *
 * @stable
 */
export declare class RouterStateSnapshot extends Tree<ActivatedRouteSnapshot> {
    /** The url from which this snapshot was created */
    url: string;
    toString(): string;
}
/**
 * The expectation is that the activate route is created with the right set of parameters.
 * So we push new values into the observables only when they are not the initial values.
 * And we detect that by checking if the snapshot field is set.
 */
export declare function advanceActivatedRoute(route: ActivatedRoute): void;
export declare function equalParamsAndUrlSegments(a: ActivatedRouteSnapshot, b: ActivatedRouteSnapshot): boolean;

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Location } from '@angular/common';
import { Compiler, Injector, NgModuleFactoryLoader, NgModuleRef, Type } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { QueryParamsHandling, Routes } from './config';
import { Event } from './events';
import { RouteReuseStrategy } from './route_reuse_strategy';
import { RouterConfigLoader } from './router_config_loader';
import { ChildrenOutletContexts } from './router_outlet_context';
import { ActivatedRoute, RouterState } from './router_state';
import { Params } from './shared';
import { UrlHandlingStrategy } from './url_handling_strategy';
import { UrlSerializer, UrlTree } from './url_tree';
/**
 * @whatItDoes Represents the extra options used during navigation.
 *
 * @stable
 */
export interface NavigationExtras {
    /**
     * Enables relative navigation from the current ActivatedRoute.
     *
     * Configuration:
     *
     * ```
     * [{
    *   path: 'parent',
    *   component: ParentComponent,
    *   children: [{
    *     path: 'list',
    *     component: ListComponent
    *   },{
    *     path: 'child',
    *     component: ChildComponent
    *   }]
    * }]
     * ```
     *
     * Navigate to list route from child route:
     *
     * ```
     *  @Component({...})
     *  class ChildComponent {
    *    constructor(private router: Router, private route: ActivatedRoute) {}
    *
    *    go() {
    *      this.router.navigate(['../list'], { relativeTo: this.route });
    *    }
    *  }
     * ```
     */
    relativeTo?: ActivatedRoute | null;
    /**
     * Sets query parameters to the URL.
     *
     * ```
     * // Navigate to /results?page=1
     * this.router.navigate(['/results'], { queryParams: { page: 1 } });
     * ```
     */
    queryParams?: Params | null;
    /**
     * Sets the hash fragment for the URL.
     *
     * ```
     * // Navigate to /results#top
     * this.router.navigate(['/results'], { fragment: 'top' });
     * ```
     */
    fragment?: string;
    /**
     * Preserves the query parameters for the next navigation.
     *
     * deprecated, use `queryParamsHandling` instead
     *
     * ```
     * // Preserve query params from /results?page=1 to /view?page=1
     * this.router.navigate(['/view'], { preserveQueryParams: true });
     * ```
     *
     * @deprecated since v4
     */
    preserveQueryParams?: boolean;
    /**
     *  config strategy to handle the query parameters for the next navigation.
     *
     * ```
     * // from /results?page=1 to /view?page=1&page=2
     * this.router.navigate(['/view'], { queryParams: { page: 2 },  queryParamsHandling: "merge" });
     * ```
     */
    queryParamsHandling?: QueryParamsHandling | null;
    /**
     * Preserves the fragment for the next navigation
     *
     * ```
     * // Preserve fragment from /results#top to /view#top
     * this.router.navigate(['/view'], { preserveFragment: true });
     * ```
     */
    preserveFragment?: boolean;
    /**
     * Navigates without pushing a new state into history.
     *
     * ```
     * // Navigate silently to /view
     * this.router.navigate(['/view'], { skipLocationChange: true });
     * ```
     */
    skipLocationChange?: boolean;
    /**
     * Navigates while replacing the current state in history.
     *
     * ```
     * // Navigate to /view
     * this.router.navigate(['/view'], { replaceUrl: true });
     * ```
     */
    replaceUrl?: boolean;
}
/**
 * @whatItDoes Error handler that is invoked when a navigation errors.
 *
 * @description
 * If the handler returns a value, the navigation promise will be resolved with this value.
 * If the handler throws an exception, the navigation promise will be rejected with
 * the exception.
 *
 * @stable
 */
export declare type ErrorHandler = (error: any) => any;
/**
 * @whatItDoes Provides the navigation and url manipulation capabilities.
 *
 * See {@link Routes} for more details and examples.
 *
 * @ngModule RouterModule
 *
 * @stable
 */
export declare class Router {
    private rootComponentType;
    protected urlSerializer: UrlSerializer;
    protected rootContexts: ChildrenOutletContexts;
    protected location: Location;
    config: Routes;
    protected currentUrlTree: UrlTree;
    protected rawUrlTree: UrlTree;
    private navigations;
    private locationSubscription;
    protected navigationId: number;
    protected configLoader: RouterConfigLoader;
    protected ngModule: NgModuleRef<any>;
    readonly events: Observable<Event>;
    readonly routerState: RouterState;
    /**
     * Error handler that is invoked when a navigation errors.
     *
     * See {@link ErrorHandler} for more information.
     */
    errorHandler: ErrorHandler;
    /**
     * Indicates if at least one navigation happened.
     */
    navigated: boolean;
    protected lastSuccessfulId: number;
    /**
     * Extracts and merges URLs. Used for AngularJS to Angular migrations.
     */
    urlHandlingStrategy: UrlHandlingStrategy;
    routeReuseStrategy: RouteReuseStrategy;
    /**
     * Define what the router should do if it receives a navigation request to the current URL.
     * By default, the router will ignore this navigation. However, this prevents features such
     * as a "refresh" button. Use this option to configure the behavior when navigating to the
     * current URL. Default is 'ignore'.
     */
    onSameUrlNavigation: 'reload' | 'ignore';
    /**
     * Defines how the router merges params, data and resolved data from parent to child
     * routes. Available options are:
     *
     * - `'emptyOnly'`, the default, only inherits parent params for path-less or component-less
     *   routes.
     * - `'always'`, enables unconditional inheritance of parent params.
     */
    paramsInheritanceStrategy: 'emptyOnly' | 'always';
    /**
     * Creates the router service.
     */
    constructor(rootComponentType: Type<any> | null, urlSerializer: UrlSerializer, rootContexts: ChildrenOutletContexts, location: Location, injector: Injector, loader: NgModuleFactoryLoader, compiler: Compiler, config: Routes);
    /**
     * Sets up the location change listener and performs the initial navigation.
     */
    initialNavigation(): void;
    /**
     * Sets up the location change listener.
     */
    setUpLocationChangeListener(): void;
    /** The current url */
    readonly url: string;
    /**
     * Resets the configuration used for navigation and generating links.
     *
     * ### Usage
     *
     * ```
     * router.resetConfig([
     *  { path: 'team/:id', component: TeamCmp, children: [
     *    { path: 'simple', component: SimpleCmp },
     *    { path: 'user/:name', component: UserCmp }
     *  ]}
     * ]);
     * ```
     */
    resetConfig(config: Routes): void;
    /** @docsNotRequired */
    ngOnDestroy(): void;
    /** Disposes of the router */
    dispose(): void;
    /**
     * Applies an array of commands to the current url tree and creates a new url tree.
     *
     * When given an activate route, applies the given commands starting from the route.
     * When not given a route, applies the given command starting from the root.
     *
     * ### Usage
     *
     * ```
     * // create /team/33/user/11
     * router.createUrlTree(['/team', 33, 'user', 11]);
     *
     * // create /team/33;expand=true/user/11
     * router.createUrlTree(['/team', 33, {expand: true}, 'user', 11]);
     *
     * // you can collapse static segments like this (this works only with the first passed-in value):
     * router.createUrlTree(['/team/33/user', userId]);
     *
     * // If the first segment can contain slashes, and you do not want the router to split it, you
     * // can do the following:
     *
     * router.createUrlTree([{segmentPath: '/one/two'}]);
     *
     * // create /team/33/(user/11//right:chat)
     * router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: 'chat'}}]);
     *
     * // remove the right secondary node
     * router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: null}}]);
     *
     * // assuming the current url is `/team/33/user/11` and the route points to `user/11`
     *
     * // navigate to /team/33/user/11/details
     * router.createUrlTree(['details'], {relativeTo: route});
     *
     * // navigate to /team/33/user/22
     * router.createUrlTree(['../22'], {relativeTo: route});
     *
     * // navigate to /team/44/user/22
     * router.createUrlTree(['../../team/44/user/22'], {relativeTo: route});
     * ```
     */
    createUrlTree(commands: any[], navigationExtras?: NavigationExtras): UrlTree;
    /**
     * Navigate based on the provided url. This navigation is always absolute.
     *
     * Returns a promise that:
     * - resolves to 'true' when navigation succeeds,
     * - resolves to 'false' when navigation fails,
     * - is rejected when an error happens.
     *
     * ### Usage
     *
     * ```
     * router.navigateByUrl("/team/33/user/11");
     *
     * // Navigate without updating the URL
     * router.navigateByUrl("/team/33/user/11", { skipLocationChange: true });
     * ```
     *
     * In opposite to `navigate`, `navigateByUrl` takes a whole URL
     * and does not apply any delta to the current one.
     */
    navigateByUrl(url: string | UrlTree, extras?: NavigationExtras): Promise<boolean>;
    /**
     * Navigate based on the provided array of commands and a starting point.
     * If no starting route is provided, the navigation is absolute.
     *
     * Returns a promise that:
     * - resolves to 'true' when navigation succeeds,
     * - resolves to 'false' when navigation fails,
     * - is rejected when an error happens.
     *
     * ### Usage
     *
     * ```
     * router.navigate(['team', 33, 'user', 11], {relativeTo: route});
     *
     * // Navigate without updating the URL
     * router.navigate(['team', 33, 'user', 11], {relativeTo: route, skipLocationChange: true});
     * ```
     *
     * In opposite to `navigateByUrl`, `navigate` always takes a delta that is applied to the current
     * URL.
     */
    navigate(commands: any[], extras?: NavigationExtras): Promise<boolean>;
    /** Serializes a {@link UrlTree} into a string */
    serializeUrl(url: UrlTree): string;
    /** Parses a string into a {@link UrlTree} */
    parseUrl(url: string): UrlTree;
    /** Returns whether the url is activated */
    isActive(url: string | UrlTree, exact: boolean): boolean;
    private removeEmptyProps(params);
    private processNavigations();
    private scheduleNavigation(rawUrl, source, state, extras);
    private executeScheduledNavigation({id, rawUrl, extras, resolve, reject, source, state});
    private runNavigate(url, rawUrl, skipLocationChange, replaceUrl, id, precreatedState);
    protected resetStateAndUrl(storedState: RouterState, storedUrl: UrlTree, rawUrl: UrlTree): void;
    protected resetUrlToCurrentUrlTree(): void;
}

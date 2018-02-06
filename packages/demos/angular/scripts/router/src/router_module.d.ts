/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HashLocationStrategy, Location, PathLocationStrategy, PlatformLocation } from '@angular/common';
import { ApplicationRef, Compiler, ComponentRef, InjectionToken, Injector, ModuleWithProviders, NgModuleFactoryLoader, NgProbeToken, Provider } from '@angular/core';
import { Route, Routes } from './config';
import { RouteReuseStrategy } from './route_reuse_strategy';
import { ErrorHandler, Router } from './router';
import { ChildrenOutletContexts } from './router_outlet_context';
import { ActivatedRoute } from './router_state';
import { UrlHandlingStrategy } from './url_handling_strategy';
import { UrlSerializer } from './url_tree';
/**
 * @whatItDoes Is used in DI to configure the router.
 * @stable
 */
export declare const ROUTER_CONFIGURATION: InjectionToken<ExtraOptions>;
/**
 * @docsNotRequired
 */
export declare const ROUTER_FORROOT_GUARD: InjectionToken<void>;
export declare const ROUTER_PROVIDERS: Provider[];
export declare function routerNgProbeToken(): NgProbeToken;
/**
 * @whatItDoes Adds router directives and providers.
 *
 * @howToUse
 *
 * RouterModule can be imported multiple times: once per lazily-loaded bundle.
 * Since the router deals with a global shared resource--location, we cannot have
 * more than one router service active.
 *
 * That is why there are two ways to create the module: `RouterModule.forRoot` and
 * `RouterModule.forChild`.
 *
 * * `forRoot` creates a module that contains all the directives, the given routes, and the router
 *   service itself.
 * * `forChild` creates a module that contains all the directives and the given routes, but does not
 *   include the router service.
 *
 * When registered at the root, the module should be used as follows
 *
 * ```
 * @NgModule({
 *   imports: [RouterModule.forRoot(ROUTES)]
 * })
 * class MyNgModule {}
 * ```
 *
 * For submodules and lazy loaded submodules the module should be used as follows:
 *
 * ```
 * @NgModule({
 *   imports: [RouterModule.forChild(ROUTES)]
 * })
 * class MyNgModule {}
 * ```
 *
 * @description
 *
 * Managing state transitions is one of the hardest parts of building applications. This is
 * especially true on the web, where you also need to ensure that the state is reflected in the URL.
 * In addition, we often want to split applications into multiple bundles and load them on demand.
 * Doing this transparently is not trivial.
 *
 * The Angular router solves these problems. Using the router, you can declaratively specify
 * application states, manage state transitions while taking care of the URL, and load bundles on
 * demand.
 *
 * [Read this developer guide](https://angular.io/docs/ts/latest/guide/router.html) to get an
 * overview of how the router should be used.
 *
 * @stable
 */
export declare class RouterModule {
    constructor(guard: any, router: Router);
    /**
     * Creates a module with all the router providers and directives. It also optionally sets up an
     * application listener to perform an initial navigation.
     *
     * Options (see {@link ExtraOptions}):
     * * `enableTracing` makes the router log all its internal events to the console.
     * * `useHash` enables the location strategy that uses the URL fragment instead of the history
     * API.
     * * `initialNavigation` disables the initial navigation.
     * * `errorHandler` provides a custom error handler.
     * * `preloadingStrategy` configures a preloading strategy (see {@link PreloadAllModules}).
     * * `onSameUrlNavigation` configures how the router handles navigation to the current URL. See
     * {@link ExtraOptions} for more details.
     */
    static forRoot(routes: Routes, config?: ExtraOptions): ModuleWithProviders;
    /**
     * Creates a module with all the router directives and a provider registering routes.
     */
    static forChild(routes: Routes): ModuleWithProviders;
}
export declare function provideLocationStrategy(platformLocationStrategy: PlatformLocation, baseHref: string, options?: ExtraOptions): HashLocationStrategy | PathLocationStrategy;
export declare function provideForRootGuard(router: Router): any;
/**
 * @whatItDoes Registers routes.
 *
 * @howToUse
 *
 * ```
 * @NgModule({
 *   imports: [RouterModule.forChild(ROUTES)],
 *   providers: [provideRoutes(EXTRA_ROUTES)]
 * })
 * class MyNgModule {}
 * ```
 *
 * @stable
 */
export declare function provideRoutes(routes: Routes): any;
/**
 * @whatItDoes Represents an option to configure when the initial navigation is performed.
 *
 * @description
 * * 'enabled' - the initial navigation starts before the root component is created.
 * The bootstrap is blocked until the initial navigation is complete.
 * * 'disabled' - the initial navigation is not performed. The location listener is set up before
 * the root component gets created.
 * * 'legacy_enabled'- the initial navigation starts after the root component has been created.
 * The bootstrap is not blocked until the initial navigation is complete. @deprecated
 * * 'legacy_disabled'- the initial navigation is not performed. The location listener is set up
 * after @deprecated
 * the root component gets created.
 * * `true` - same as 'legacy_enabled'. @deprecated since v4
 * * `false` - same as 'legacy_disabled'. @deprecated since v4
 *
 * The 'enabled' option should be used for applications unless there is a reason to have
 * more control over when the router starts its initial navigation due to some complex
 * initialization logic. In this case, 'disabled' should be used.
 *
 * The 'legacy_enabled' and 'legacy_disabled' should not be used for new applications.
 *
 * @experimental
 */
export declare type InitialNavigation = true | false | 'enabled' | 'disabled' | 'legacy_enabled' | 'legacy_disabled';
/**
 * @whatItDoes Represents options to configure the router.
 *
 * @stable
 */
export interface ExtraOptions {
    /**
     * Makes the router log all its internal events to the console.
     */
    enableTracing?: boolean;
    /**
     * Enables the location strategy that uses the URL fragment instead of the history API.
     */
    useHash?: boolean;
    /**
     * Disables the initial navigation.
     */
    initialNavigation?: InitialNavigation;
    /**
     * A custom error handler.
     */
    errorHandler?: ErrorHandler;
    /**
     * Configures a preloading strategy. See {@link PreloadAllModules}.
     */
    preloadingStrategy?: any;
    /**
     * Define what the router should do if it receives a navigation request to the current URL.
     * By default, the router will ignore this navigation. However, this prevents features such
     * as a "refresh" button. Use this option to configure the behavior when navigating to the
     * current URL. Default is 'ignore'.
     */
    onSameUrlNavigation?: 'reload' | 'ignore';
    /**
     * Defines how the router merges params, data and resolved data from parent to child
     * routes. Available options are:
     *
     * - `'emptyOnly'`, the default, only inherits parent params for path-less or component-less
     *   routes.
     * - `'always'`, enables unconditional inheritance of parent params.
     */
    paramsInheritanceStrategy?: 'emptyOnly' | 'always';
}
export declare function setupRouter(ref: ApplicationRef, urlSerializer: UrlSerializer, contexts: ChildrenOutletContexts, location: Location, injector: Injector, loader: NgModuleFactoryLoader, compiler: Compiler, config: Route[][], opts?: ExtraOptions, urlHandlingStrategy?: UrlHandlingStrategy, routeReuseStrategy?: RouteReuseStrategy): Router;
export declare function rootRoute(router: Router): ActivatedRoute;
/**
 * To initialize the router properly we need to do in two steps:
 *
 * We need to start the navigation in a APP_INITIALIZER to block the bootstrap if
 * a resolver or a guards executes asynchronously. Second, we need to actually run
 * activation in a BOOTSTRAP_LISTENER. We utilize the afterPreactivation
 * hook provided by the router to do that.
 *
 * The router navigation starts, reaches the point when preactivation is done, and then
 * pauses. It waits for the hook to be resolved. We then resolve it only in a bootstrap listener.
 */
export declare class RouterInitializer {
    private injector;
    private initNavigation;
    private resultOfPreactivationDone;
    constructor(injector: Injector);
    appInitializer(): Promise<any>;
    bootstrapListener(bootstrappedComponentRef: ComponentRef<any>): void;
    private isLegacyEnabled(opts);
    private isLegacyDisabled(opts);
}
export declare function getAppInitializer(r: RouterInitializer): any;
export declare function getBootstrapListener(r: RouterInitializer): any;
/**
 * A token for the router initializer that will be called after the app is bootstrapped.
 *
 * @experimental
 */
export declare const ROUTER_INITIALIZER: InjectionToken<(compRef: ComponentRef<any>) => void>;
export declare function provideRouterInitializer(): (typeof RouterInitializer | {
    provide: InjectionToken<(() => void)[]>;
    multi: boolean;
    useFactory: (r: RouterInitializer) => any;
    deps: (typeof RouterInitializer)[];
} | {
    provide: InjectionToken<(compRef: ComponentRef<any>) => void>;
    useFactory: (r: RouterInitializer) => any;
    deps: (typeof RouterInitializer)[];
} | {
    provide: InjectionToken<((compRef: ComponentRef<any>) => void)[]>;
    multi: boolean;
    useExisting: InjectionToken<(compRef: ComponentRef<any>) => void>;
})[];

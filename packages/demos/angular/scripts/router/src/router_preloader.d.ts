/**
*@license
*Copyright Google Inc. All Rights Reserved.
*
*Use of this source code is governed by an MIT-style license that can be
*found in the LICENSE file at https://angular.io/license
*/
import { Compiler, Injector, NgModuleFactoryLoader, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Route } from './config';
import { Router } from './router';
/**
 * @whatItDoes Provides a preloading strategy.
 *
 * @experimental
 */
export declare abstract class PreloadingStrategy {
    abstract preload(route: Route, fn: () => Observable<any>): Observable<any>;
}
/**
 * @whatItDoes Provides a preloading strategy that preloads all modules as quickly as possible.
 *
 * @howToUse
 *
 * ```
 * RouteModule.forRoot(ROUTES, {preloadingStrategy: PreloadAllModules})
 * ```
 *
 * @experimental
 */
export declare class PreloadAllModules implements PreloadingStrategy {
    preload(route: Route, fn: () => Observable<any>): Observable<any>;
}
/**
 * @whatItDoes Provides a preloading strategy that does not preload any modules.
 *
 * @description
 *
 * This strategy is enabled by default.
 *
 * @experimental
 */
export declare class NoPreloading implements PreloadingStrategy {
    preload(route: Route, fn: () => Observable<any>): Observable<any>;
}
/**
 * The preloader optimistically loads all router configurations to
 * make navigations into lazily-loaded sections of the application faster.
 *
 * The preloader runs in the background. When the router bootstraps, the preloader
 * starts listening to all navigation events. After every such event, the preloader
 * will check if any configurations can be loaded lazily.
 *
 * If a route is protected by `canLoad` guards, the preloaded will not load it.
 *
 * @stable
 */
export declare class RouterPreloader implements OnDestroy {
    private router;
    private injector;
    private preloadingStrategy;
    private loader;
    private subscription;
    constructor(router: Router, moduleLoader: NgModuleFactoryLoader, compiler: Compiler, injector: Injector, preloadingStrategy: PreloadingStrategy);
    setUpPreloading(): void;
    preload(): Observable<any>;
    ngOnDestroy(): void;
    private processRoutes(ngModule, routes);
    private preloadConfig(ngModule, route);
}

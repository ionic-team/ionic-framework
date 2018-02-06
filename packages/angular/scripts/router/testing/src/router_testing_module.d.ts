/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Location } from '@angular/common';
import { Compiler, Injector, ModuleWithProviders, NgModuleFactory, NgModuleFactoryLoader } from '@angular/core';
import { ChildrenOutletContexts, ExtraOptions, Route, Router, Routes, UrlHandlingStrategy, UrlSerializer } from '@angular/router';
/**
 * @whatItDoes Allows to simulate the loading of ng modules in tests.
 *
 * @howToUse
 *
 * ```
 * const loader = TestBed.get(NgModuleFactoryLoader);
 *
 * @Component({template: 'lazy-loaded'})
 * class LazyLoadedComponent {}
 * @NgModule({
 *   declarations: [LazyLoadedComponent],
 *   imports: [RouterModule.forChild([{path: 'loaded', component: LazyLoadedComponent}])]
 * })
 *
 * class LoadedModule {}
 *
 * // sets up stubbedModules
 * loader.stubbedModules = {lazyModule: LoadedModule};
 *
 * router.resetConfig([
 *   {path: 'lazy', loadChildren: 'lazyModule'},
 * ]);
 *
 * router.navigateByUrl('/lazy/loaded');
 * ```
 *
 * @stable
 */
export declare class SpyNgModuleFactoryLoader implements NgModuleFactoryLoader {
    private compiler;
    /**
     * @docsNotRequired
     */
    private _stubbedModules;
    /**
     * @docsNotRequired
     */
    /**
     * @docsNotRequired
     */
    stubbedModules: {
        [path: string]: any;
    };
    constructor(compiler: Compiler);
    load(path: string): Promise<NgModuleFactory<any>>;
}
/**
 * Router setup factory function used for testing.
 *
 * @stable
 */
export declare function setupTestingRouter(urlSerializer: UrlSerializer, contexts: ChildrenOutletContexts, location: Location, loader: NgModuleFactoryLoader, compiler: Compiler, injector: Injector, routes: Route[][], opts?: ExtraOptions, urlHandlingStrategy?: UrlHandlingStrategy): Router;
/**
 * Router setup factory function used for testing.
 *
 * @deprecated As of v5.2. The 2nd-to-last argument should be `ExtraOptions`, not
 * `UrlHandlingStrategy`
 */
export declare function setupTestingRouter(urlSerializer: UrlSerializer, contexts: ChildrenOutletContexts, location: Location, loader: NgModuleFactoryLoader, compiler: Compiler, injector: Injector, routes: Route[][], urlHandlingStrategy?: UrlHandlingStrategy): Router;
/**
 * @whatItDoes Sets up the router to be used for testing.
 *
 * @howToUse
 *
 * ```
 * beforeEach(() => {
 *   TestBed.configureTestModule({
 *     imports: [
 *       RouterTestingModule.withRoutes(
 *         [{path: '', component: BlankCmp}, {path: 'simple', component: SimpleCmp}]
 *       )
 *     ]
 *   });
 * });
 * ```
 *
 * @description
 *
 * The modules sets up the router to be used for testing.
 * It provides spy implementations of {@link Location}, {@link LocationStrategy}, and {@link
 * NgModuleFactoryLoader}.
 *
 * @stable
 */
export declare class RouterTestingModule {
    static withRoutes(routes: Routes, config?: ExtraOptions): ModuleWithProviders;
}

/**
 * @license Angular v6.0.0-beta.2-8c5c0dac1
 * (c) 2010-2018 Google, Inc. https://angular.io/
 * License: MIT
 */
import { Location, LocationStrategy } from '@angular/common';
import { MockLocationStrategy, SpyLocation } from '@angular/common/testing';
import { Compiler, Injectable, Injector, NgModule, NgModuleFactoryLoader, Optional } from '@angular/core';
import { ChildrenOutletContexts, NoPreloading, PreloadingStrategy, ROUTER_CONFIGURATION, ROUTES, Router, RouterModule, UrlHandlingStrategy, UrlSerializer, provideRoutes, ɵROUTER_PROVIDERS, ɵflatten } from '@angular/router';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * \@whatItDoes Allows to simulate the loading of ng modules in tests.
 *
 * \@howToUse
 *
 * ```
 * const loader = TestBed.get(NgModuleFactoryLoader);
 *
 * \@Component({template: 'lazy-loaded'})
 * class LazyLoadedComponent {}
 * \@NgModule({
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
 * \@stable
 */
var SpyNgModuleFactoryLoader = /** @class */ (function () {
    function SpyNgModuleFactoryLoader(compiler) {
        this.compiler = compiler;
        /**
         * \@docsNotRequired
         */
        this._stubbedModules = {};
    }
    Object.defineProperty(SpyNgModuleFactoryLoader.prototype, "stubbedModules", {
        /**
         * @docsNotRequired
         */
        get: /**
         * \@docsNotRequired
         * @return {?}
         */
        function () { return this._stubbedModules; },
        /**
         * @docsNotRequired
         */
        set: /**
         * \@docsNotRequired
         * @param {?} modules
         * @return {?}
         */
        function (modules) {
            var /** @type {?} */ res = {};
            for (var _i = 0, _a = Object.keys(modules); _i < _a.length; _i++) {
                var t = _a[_i];
                res[t] = this.compiler.compileModuleAsync(modules[t]);
            }
            this._stubbedModules = res;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} path
     * @return {?}
     */
    SpyNgModuleFactoryLoader.prototype.load = /**
     * @param {?} path
     * @return {?}
     */
    function (path) {
        if (this._stubbedModules[path]) {
            return this._stubbedModules[path];
        }
        else {
            return /** @type {?} */ (Promise.reject(new Error("Cannot find module " + path)));
        }
    };
    SpyNgModuleFactoryLoader.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    SpyNgModuleFactoryLoader.ctorParameters = function () { return [
        { type: Compiler, },
    ]; };
    return SpyNgModuleFactoryLoader;
}());
/**
 * @param {?} opts
 * @return {?}
 */
function isUrlHandlingStrategy(opts) {
    // This property check is needed because UrlHandlingStrategy is an interface and doesn't exist at
    // runtime.
    return 'shouldProcessUrl' in opts;
}
/**
 * Router setup factory function used for testing.
 *
 * \@stable
 * @param {?} urlSerializer
 * @param {?} contexts
 * @param {?} location
 * @param {?} loader
 * @param {?} compiler
 * @param {?} injector
 * @param {?} routes
 * @param {?=} opts
 * @param {?=} urlHandlingStrategy
 * @return {?}
 */
function setupTestingRouter(urlSerializer, contexts, location, loader, compiler, injector, routes, opts, urlHandlingStrategy) {
    var /** @type {?} */ router = new Router(/** @type {?} */ ((null)), urlSerializer, contexts, location, injector, loader, compiler, ɵflatten(routes));
    // Handle deprecated argument ordering.
    if (opts) {
        if (isUrlHandlingStrategy(opts)) {
            router.urlHandlingStrategy = opts;
        }
        else if (opts.paramsInheritanceStrategy) {
            router.paramsInheritanceStrategy = opts.paramsInheritanceStrategy;
        }
    }
    if (urlHandlingStrategy) {
        router.urlHandlingStrategy = urlHandlingStrategy;
    }
    return router;
}
/**
 * \@whatItDoes Sets up the router to be used for testing.
 *
 * \@howToUse
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
 * \@description
 *
 * The modules sets up the router to be used for testing.
 * It provides spy implementations of {\@link Location}, {\@link LocationStrategy}, and {\@link
 * NgModuleFactoryLoader}.
 *
 * \@stable
 */
var RouterTestingModule = /** @class */ (function () {
    function RouterTestingModule() {
    }
    /**
     * @param {?} routes
     * @param {?=} config
     * @return {?}
     */
    RouterTestingModule.withRoutes = /**
     * @param {?} routes
     * @param {?=} config
     * @return {?}
     */
    function (routes, config) {
        return {
            ngModule: RouterTestingModule,
            providers: [
                provideRoutes(routes),
                { provide: ROUTER_CONFIGURATION, useValue: config ? config : {} },
            ]
        };
    };
    RouterTestingModule.decorators = [
        { type: NgModule, args: [{
                    exports: [RouterModule],
                    providers: [
                        ɵROUTER_PROVIDERS, { provide: Location, useClass: SpyLocation },
                        { provide: LocationStrategy, useClass: MockLocationStrategy },
                        { provide: NgModuleFactoryLoader, useClass: SpyNgModuleFactoryLoader }, {
                            provide: Router,
                            useFactory: setupTestingRouter,
                            deps: [
                                UrlSerializer, ChildrenOutletContexts, Location, NgModuleFactoryLoader, Compiler, Injector,
                                ROUTES, ROUTER_CONFIGURATION, [UrlHandlingStrategy, new Optional()]
                            ]
                        },
                        { provide: PreloadingStrategy, useExisting: NoPreloading }, provideRoutes([])
                    ]
                },] },
    ];
    /** @nocollapse */
    RouterTestingModule.ctorParameters = function () { return []; };
    return RouterTestingModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all public APIs of the router/testing package.
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point for all public APIs of this package.
 */

// This file only reexports content of the `src` folder. Keep it that way.

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { SpyNgModuleFactoryLoader, setupTestingRouter, RouterTestingModule };
//# sourceMappingURL=testing.js.map

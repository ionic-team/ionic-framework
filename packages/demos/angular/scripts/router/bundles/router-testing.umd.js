/**
 * @license Angular v6.0.0-beta.2-8c5c0dac1
 * (c) 2010-2018 Google, Inc. https://angular.io/
 * License: MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/common/testing'), require('@angular/core'), require('@angular/router')) :
	typeof define === 'function' && define.amd ? define('@angular/router/testing', ['exports', '@angular/common', '@angular/common/testing', '@angular/core', '@angular/router'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.router = global.ng.router || {}, global.ng.router.testing = {}),global.ng.common,global.ng.common.testing,global.ng.core,global.ng.router));
}(this, (function (exports,_angular_common,_angular_common_testing,_angular_core,_angular_router) { 'use strict';

/**
 * @license Angular v6.0.0-beta.2-8c5c0dac1
 * (c) 2010-2018 Google, Inc. https://angular.io/
 * License: MIT
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
        { type: _angular_core.Injectable },
    ];
    /** @nocollapse */
    SpyNgModuleFactoryLoader.ctorParameters = function () { return [
        { type: _angular_core.Compiler, },
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
    var /** @type {?} */ router = new _angular_router.Router(/** @type {?} */ ((null)), urlSerializer, contexts, location, injector, loader, compiler, _angular_router.ɵflatten(routes));
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
                _angular_router.provideRoutes(routes),
                { provide: _angular_router.ROUTER_CONFIGURATION, useValue: config ? config : {} },
            ]
        };
    };
    RouterTestingModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    exports: [_angular_router.RouterModule],
                    providers: [
                        _angular_router.ɵROUTER_PROVIDERS, { provide: _angular_common.Location, useClass: _angular_common_testing.SpyLocation },
                        { provide: _angular_common.LocationStrategy, useClass: _angular_common_testing.MockLocationStrategy },
                        { provide: _angular_core.NgModuleFactoryLoader, useClass: SpyNgModuleFactoryLoader }, {
                            provide: _angular_router.Router,
                            useFactory: setupTestingRouter,
                            deps: [
                                _angular_router.UrlSerializer, _angular_router.ChildrenOutletContexts, _angular_common.Location, _angular_core.NgModuleFactoryLoader, _angular_core.Compiler, _angular_core.Injector,
                                _angular_router.ROUTES, _angular_router.ROUTER_CONFIGURATION, [_angular_router.UrlHandlingStrategy, new _angular_core.Optional()]
                            ]
                        },
                        { provide: _angular_router.PreloadingStrategy, useExisting: _angular_router.NoPreloading }, _angular_router.provideRoutes([])
                    ]
                },] },
    ];
    /** @nocollapse */
    RouterTestingModule.ctorParameters = function () { return []; };
    return RouterTestingModule;
}());

exports.SpyNgModuleFactoryLoader = SpyNgModuleFactoryLoader;
exports.setupTestingRouter = setupTestingRouter;
exports.RouterTestingModule = RouterTestingModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=router-testing.umd.js.map

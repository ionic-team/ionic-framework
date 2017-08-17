(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./ng-module-loader", "./util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var ng_module_loader_1 = require("./ng-module-loader");
    var util_1 = require("./util");
    exports.LAZY_LOADED_TOKEN = new core_1.OpaqueToken('LZYCMP');
    /**
     * @hidden
     */
    var ModuleLoader = (function () {
        /**
         * @param {?} _ngModuleLoader
         * @param {?} _injector
         */
        function ModuleLoader(_ngModuleLoader, _injector) {
            this._ngModuleLoader = _ngModuleLoader;
            this._injector = _injector;
            /**
             * \@internal
             */
            this._cfrMap = new Map();
            this._promiseMap = new Map();
        }
        /**
         * @param {?} modulePath
         * @return {?}
         */
        ModuleLoader.prototype.load = function (modulePath) {
            var _this = this;
            (void 0) /* console.time */;
            var /** @type {?} */ splitString = modulePath.split(SPLITTER);
            var /** @type {?} */ promise = this._promiseMap.get(modulePath);
            if (!promise) {
                promise = this._ngModuleLoader.load(splitString[0], splitString[1]);
                this._promiseMap.set(modulePath, promise);
            }
            return promise.then(function (loadedModule) {
                (void 0) /* console.timeEnd */;
                var /** @type {?} */ ref = loadedModule.create(_this._injector);
                var /** @type {?} */ component = ref.injector.get(exports.LAZY_LOADED_TOKEN);
                _this._cfrMap.set(component, ref.componentFactoryResolver);
                return {
                    componentFactoryResolver: ref.componentFactoryResolver,
                    component: component
                };
            });
        };
        /**
         * @param {?} component
         * @return {?}
         */
        ModuleLoader.prototype.getComponentFactoryResolver = function (component) {
            return this._cfrMap.get(component);
        };
        return ModuleLoader;
    }());
    ModuleLoader.decorators = [
        { type: core_1.Injectable },
    ];
    /**
     * @nocollapse
     */
    ModuleLoader.ctorParameters = function () { return [
        { type: ng_module_loader_1.NgModuleLoader, },
        { type: core_1.Injector, },
    ]; };
    exports.ModuleLoader = ModuleLoader;
    function ModuleLoader_tsickle_Closure_declarations() {
        /** @type {?} */
        ModuleLoader.decorators;
        /**
         * @nocollapse
         * @type {?}
         */
        ModuleLoader.ctorParameters;
        /**
         * \@internal
         * @type {?}
         */
        ModuleLoader.prototype._cfrMap;
        /** @type {?} */
        ModuleLoader.prototype._promiseMap;
        /** @type {?} */
        ModuleLoader.prototype._ngModuleLoader;
        /** @type {?} */
        ModuleLoader.prototype._injector;
    }
    var /** @type {?} */ SPLITTER = '#';
    /**
     * @hidden
     * @param {?} ngModuleLoader
     * @param {?} injector
     * @return {?}
     */
    function provideModuleLoader(ngModuleLoader, injector) {
        return new ModuleLoader(ngModuleLoader, injector);
    }
    exports.provideModuleLoader = provideModuleLoader;
    /**
     * @hidden
     * @param {?} config
     * @param {?} deepLinkConfig
     * @param {?} moduleLoader
     * @return {?}
     */
    function setupPreloadingImplementation(config, deepLinkConfig, moduleLoader) {
        if (!deepLinkConfig || !deepLinkConfig.links || !config.getBoolean('preloadModules')) {
            return Promise.resolve();
        }
        var /** @type {?} */ linksToLoad = deepLinkConfig.links.filter(function (link) { return !!link.loadChildren && link.priority !== 'off'; });
        // Load the high priority modules first
        var /** @type {?} */ highPriorityPromises = linksToLoad
            .filter(function (link) { return link.priority === 'high'; })
            .map(function (link) { return moduleLoader.load(link.loadChildren); });
        return Promise.all(highPriorityPromises).then(function () {
            // Load the low priority modules after the high priority are done
            var /** @type {?} */ lowPriorityPromises = linksToLoad
                .filter(function (link) { return link.priority === 'low'; })
                .map(function (link) { return moduleLoader.load(link.loadChildren); });
            return Promise.all(lowPriorityPromises);
        }).catch(function (err) {
            console.error(err.message);
        });
    }
    exports.setupPreloadingImplementation = setupPreloadingImplementation;
    /**
     * @hidden
     * @param {?} config
     * @param {?} deepLinkConfig
     * @param {?} moduleLoader
     * @param {?} ngZone
     * @return {?}
     */
    function setupPreloading(config, deepLinkConfig, moduleLoader, ngZone) {
        return function () {
            util_1.requestIonicCallback(function () {
                ngZone.runOutsideAngular(function () {
                    setupPreloadingImplementation(config, deepLinkConfig, moduleLoader);
                });
            });
        };
    }
    exports.setupPreloading = setupPreloading;
});
//# sourceMappingURL=module-loader.js.map
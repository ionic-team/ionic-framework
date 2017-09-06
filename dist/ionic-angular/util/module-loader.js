import { Injectable, Injector, OpaqueToken } from '@angular/core';
import { NgModuleLoader } from './ng-module-loader';
import { requestIonicCallback } from './util';
export var /** @type {?} */ LAZY_LOADED_TOKEN = new OpaqueToken('LZYCMP');
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
            var /** @type {?} */ component = ref.injector.get(LAZY_LOADED_TOKEN);
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
export { ModuleLoader };
ModuleLoader.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
ModuleLoader.ctorParameters = function () { return [
    { type: NgModuleLoader, },
    { type: Injector, },
]; };
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
export function provideModuleLoader(ngModuleLoader, injector) {
    return new ModuleLoader(ngModuleLoader, injector);
}
/**
 * @hidden
 * @param {?} config
 * @param {?} deepLinkConfig
 * @param {?} moduleLoader
 * @return {?}
 */
export function setupPreloadingImplementation(config, deepLinkConfig, moduleLoader) {
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
/**
 * @hidden
 * @param {?} config
 * @param {?} deepLinkConfig
 * @param {?} moduleLoader
 * @param {?} ngZone
 * @return {?}
 */
export function setupPreloading(config, deepLinkConfig, moduleLoader, ngZone) {
    return function () {
        requestIonicCallback(function () {
            ngZone.runOutsideAngular(function () {
                setupPreloadingImplementation(config, deepLinkConfig, moduleLoader);
            });
        });
    };
}
//# sourceMappingURL=module-loader.js.map
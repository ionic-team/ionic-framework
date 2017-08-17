import { Injectable, Injector, OpaqueToken } from '@angular/core';
import { NgModuleLoader } from './ng-module-loader';
import { requestIonicCallback } from './util';
export const /** @type {?} */ LAZY_LOADED_TOKEN = new OpaqueToken('LZYCMP');
/**
 * @hidden
 */
export class ModuleLoader {
    /**
     * @param {?} _ngModuleLoader
     * @param {?} _injector
     */
    constructor(_ngModuleLoader, _injector) {
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
    load(modulePath) {
        (void 0) /* console.time */;
        const /** @type {?} */ splitString = modulePath.split(SPLITTER);
        let /** @type {?} */ promise = this._promiseMap.get(modulePath);
        if (!promise) {
            promise = this._ngModuleLoader.load(splitString[0], splitString[1]);
            this._promiseMap.set(modulePath, promise);
        }
        return promise.then(loadedModule => {
            (void 0) /* console.timeEnd */;
            const /** @type {?} */ ref = loadedModule.create(this._injector);
            const /** @type {?} */ component = ref.injector.get(LAZY_LOADED_TOKEN);
            this._cfrMap.set(component, ref.componentFactoryResolver);
            return {
                componentFactoryResolver: ref.componentFactoryResolver,
                component: component
            };
        });
    }
    /**
     * @param {?} component
     * @return {?}
     */
    getComponentFactoryResolver(component) {
        return this._cfrMap.get(component);
    }
}
ModuleLoader.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
ModuleLoader.ctorParameters = () => [
    { type: NgModuleLoader, },
    { type: Injector, },
];
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
const /** @type {?} */ SPLITTER = '#';
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
    const /** @type {?} */ linksToLoad = deepLinkConfig.links.filter(link => !!link.loadChildren && link.priority !== 'off');
    // Load the high priority modules first
    const /** @type {?} */ highPriorityPromises = linksToLoad
        .filter(link => link.priority === 'high')
        .map(link => moduleLoader.load(link.loadChildren));
    return Promise.all(highPriorityPromises).then(() => {
        // Load the low priority modules after the high priority are done
        const /** @type {?} */ lowPriorityPromises = linksToLoad
            .filter(link => link.priority === 'low')
            .map(link => moduleLoader.load(link.loadChildren));
        return Promise.all(lowPriorityPromises);
    }).catch(err => {
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
        requestIonicCallback(() => {
            ngZone.runOutsideAngular(() => {
                setupPreloadingImplementation(config, deepLinkConfig, moduleLoader);
            });
        });
    };
}
//# sourceMappingURL=module-loader.js.map
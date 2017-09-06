import { Compiler, Injectable } from '@angular/core';
/**
 * NgModuleFactoryLoader that uses SystemJS to load NgModuleFactory
 */
export class NgModuleLoader {
    /**
     * @param {?} _compiler
     */
    constructor(_compiler) {
        this._compiler = _compiler;
    }
    /**
     * @param {?} modulePath
     * @param {?} ngModuleExport
     * @return {?}
     */
    load(modulePath, ngModuleExport) {
        const /** @type {?} */ offlineMode = this._compiler instanceof Compiler;
        return offlineMode ? loadPrecompiledFactory(modulePath, ngModuleExport) : loadAndCompile(this._compiler, modulePath, ngModuleExport);
    }
}
NgModuleLoader.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
NgModuleLoader.ctorParameters = () => [
    { type: Compiler, },
];
function NgModuleLoader_tsickle_Closure_declarations() {
    /** @type {?} */
    NgModuleLoader.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    NgModuleLoader.ctorParameters;
    /** @type {?} */
    NgModuleLoader.prototype._compiler;
}
/**
 * @param {?} compiler
 * @param {?} modulePath
 * @param {?} ngModuleExport
 * @return {?}
 */
function loadAndCompile(compiler, modulePath, ngModuleExport) {
    if (!ngModuleExport) {
        ngModuleExport = 'default';
    }
    return System.import(modulePath)
        .then((rawModule) => {
        const /** @type {?} */ module = rawModule[ngModuleExport];
        if (!module) {
            throw new Error(`Module ${modulePath} does not export ${ngModuleExport}`);
        }
        return compiler.compileModuleAsync(module);
    });
}
/**
 * @param {?} modulePath
 * @param {?} ngModuleExport
 * @return {?}
 */
function loadPrecompiledFactory(modulePath, ngModuleExport) {
    return System.import(modulePath)
        .then((rawModule) => {
        const /** @type {?} */ ngModuleFactory = rawModule[ngModuleExport];
        if (!ngModuleFactory) {
            throw new Error(`Module ${modulePath} does not export ${ngModuleExport}`);
        }
        return ngModuleFactory;
    });
}
//# sourceMappingURL=ng-module-loader.js.map
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * This is a private API for the ngtools toolkit.
 *
 * This API should be stable for NG 2. It can be removed in NG 4..., but should be replaced by
 * something else.
 */
var compiler_1 = require("@angular/compiler");
var codegen_1 = require("./codegen");
var compiler_host_1 = require("./compiler_host");
var extractor_1 = require("./extractor");
var ngtools_impl_1 = require("./ngtools_impl");
var path_mapped_compiler_host_1 = require("./path_mapped_compiler_host");
/**
 * A ModuleResolutionHostAdapter that overrides the readResource() method with the one
 * passed in the interface.
 */
var CustomLoaderModuleResolutionHostAdapter = (function (_super) {
    __extends(CustomLoaderModuleResolutionHostAdapter, _super);
    function CustomLoaderModuleResolutionHostAdapter(_readResource, host) {
        var _this = _super.call(this, host) || this;
        _this._readResource = _readResource;
        return _this;
    }
    CustomLoaderModuleResolutionHostAdapter.prototype.readResource = function (path) { return this._readResource(path); };
    return CustomLoaderModuleResolutionHostAdapter;
}(compiler_host_1.ModuleResolutionHostAdapter));
/**
 * @internal
 * @private
 */
var NgTools_InternalApi_NG_2 = (function () {
    function NgTools_InternalApi_NG_2() {
    }
    /**
     * @internal
     * @private
     */
    NgTools_InternalApi_NG_2.codeGen = function (options) {
        var hostContext = new CustomLoaderModuleResolutionHostAdapter(options.readResource, options.host);
        var cliOptions = {
            i18nFormat: options.i18nFormat,
            i18nFile: options.i18nFile,
            locale: options.locale,
            basePath: options.basePath
        };
        // Create the Code Generator.
        var codeGenerator = codegen_1.CodeGenerator.create(options.angularCompilerOptions, cliOptions, options.program, options.host, hostContext);
        return codeGenerator.codegen();
    };
    /**
     * @internal
     * @private
     */
    NgTools_InternalApi_NG_2.listLazyRoutes = function (options) {
        var angularCompilerOptions = options.angularCompilerOptions;
        var program = options.program;
        var moduleResolutionHost = new compiler_host_1.ModuleResolutionHostAdapter(options.host);
        var usePathMapping = !!angularCompilerOptions.rootDirs && angularCompilerOptions.rootDirs.length > 0;
        var ngCompilerHost = usePathMapping ?
            new path_mapped_compiler_host_1.PathMappedCompilerHost(program, angularCompilerOptions, moduleResolutionHost) :
            new compiler_host_1.CompilerHost(program, angularCompilerOptions, moduleResolutionHost);
        var symbolCache = new compiler_1.StaticSymbolCache();
        var summaryResolver = new compiler_1.AotSummaryResolver(ngCompilerHost, symbolCache);
        var symbolResolver = new compiler_1.StaticSymbolResolver(ngCompilerHost, symbolCache, summaryResolver);
        var staticReflector = new compiler_1.StaticReflector(summaryResolver, symbolResolver);
        var routeMap = ngtools_impl_1.listLazyRoutesOfModule(options.entryModule, ngCompilerHost, staticReflector);
        return Object.keys(routeMap).reduce(function (acc, route) {
            acc[route] = routeMap[route].absoluteFilePath;
            return acc;
        }, {});
    };
    /**
     * @internal
     * @private
     */
    NgTools_InternalApi_NG_2.extractI18n = function (options) {
        var hostContext = new CustomLoaderModuleResolutionHostAdapter(options.readResource, options.host);
        // Create the i18n extractor.
        var locale = options.locale || null;
        var extractor = extractor_1.Extractor.create(options.angularCompilerOptions, options.program, options.host, locale, hostContext);
        return extractor.extract(options.i18nFormat, options.outFile || null);
    };
    return NgTools_InternalApi_NG_2;
}());
exports.NgTools_InternalApi_NG_2 = NgTools_InternalApi_NG_2;
//# sourceMappingURL=ngtools_api.js.map
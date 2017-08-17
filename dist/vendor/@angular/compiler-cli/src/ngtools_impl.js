/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
/**
 * This is a private API for the ngtools toolkit.
 *
 * This API should be stable for NG 2. It can be removed in NG 4..., but should be replaced by
 * something else.
 */
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var ROUTER_MODULE_PATH = '@angular/router';
var ROUTER_ROUTES_SYMBOL_NAME = 'ROUTES';
// A route definition. Normally the short form 'path/to/module#ModuleClassName' is used by
// the user, and this is a helper class to extract information from it.
var RouteDef = (function () {
    function RouteDef(path, className) {
        if (className === void 0) { className = null; }
        this.path = path;
        this.className = className;
    }
    RouteDef.prototype.toString = function () {
        return (this.className === null || this.className == 'default') ?
            this.path :
            this.path + "#" + this.className;
    };
    RouteDef.fromString = function (entry) {
        var split = entry.split('#');
        return new RouteDef(split[0], split[1] || null);
    };
    return RouteDef;
}());
exports.RouteDef = RouteDef;
/**
 *
 * @returns {LazyRouteMap}
 * @private
 */
function listLazyRoutesOfModule(entryModule, host, reflector) {
    var entryRouteDef = RouteDef.fromString(entryModule);
    var containingFile = _resolveModule(entryRouteDef.path, entryRouteDef.path, host);
    var modulePath = "./" + containingFile.replace(/^(.*)\//, '');
    var className = entryRouteDef.className;
    // List loadChildren of this single module.
    var appStaticSymbol = reflector.findDeclaration(modulePath, className, containingFile);
    var ROUTES = reflector.findDeclaration(ROUTER_MODULE_PATH, ROUTER_ROUTES_SYMBOL_NAME);
    var lazyRoutes = _extractLazyRoutesFromStaticModule(appStaticSymbol, reflector, host, ROUTES);
    var allLazyRoutes = lazyRoutes.reduce(function includeLazyRouteAndSubRoutes(allRoutes, lazyRoute) {
        var route = lazyRoute.routeDef.toString();
        _assertRoute(allRoutes, lazyRoute);
        allRoutes[route] = lazyRoute;
        // StaticReflector does not support discovering annotations like `NgModule` on default
        // exports
        // Which means: if a default export NgModule was lazy-loaded, we can discover it, but,
        //  we cannot parse its routes to see if they have loadChildren or not.
        if (!lazyRoute.routeDef.className) {
            return allRoutes;
        }
        var lazyModuleSymbol = reflector.findDeclaration(lazyRoute.absoluteFilePath, lazyRoute.routeDef.className || 'default');
        var subRoutes = _extractLazyRoutesFromStaticModule(lazyModuleSymbol, reflector, host, ROUTES);
        return subRoutes.reduce(includeLazyRouteAndSubRoutes, allRoutes);
    }, {});
    return allLazyRoutes;
}
exports.listLazyRoutesOfModule = listLazyRoutesOfModule;
/**
 * Try to resolve a module, and returns its absolute path.
 * @private
 */
function _resolveModule(modulePath, containingFile, host) {
    var result = host.moduleNameToFileName(modulePath, containingFile);
    if (!result) {
        throw new Error("Could not resolve \"" + modulePath + "\" from \"" + containingFile + "\".");
    }
    return result;
}
/**
 * Throw an exception if a route is in a route map, but does not point to the same module.
 * @private
 */
function _assertRoute(map, route) {
    var r = route.routeDef.toString();
    if (map[r] && map[r].absoluteFilePath != route.absoluteFilePath) {
        throw new Error("Duplicated path in loadChildren detected: \"" + r + "\" is used in 2 loadChildren, " +
            ("but they point to different modules \"(" + map[r].absoluteFilePath + " and ") +
            ("\"" + route.absoluteFilePath + "\"). Webpack cannot distinguish on context and would fail to ") +
            'load the proper one.');
    }
}
/**
 * Extract all the LazyRoutes from a module. This extracts all `loadChildren` keys from this
 * module and all statically referred modules.
 * @private
 */
function _extractLazyRoutesFromStaticModule(staticSymbol, reflector, host, ROUTES) {
    var moduleMetadata = _getNgModuleMetadata(staticSymbol, reflector);
    var allRoutes = (moduleMetadata.imports || [])
        .filter(function (i) { return 'providers' in i; })
        .reduce(function (mem, m) {
        return mem.concat(_collectRoutes(m.providers || [], reflector, ROUTES));
    }, _collectRoutes(moduleMetadata.providers || [], reflector, ROUTES));
    var lazyRoutes = _collectLoadChildren(allRoutes).reduce(function (acc, route) {
        var routeDef = RouteDef.fromString(route);
        var absoluteFilePath = _resolveModule(routeDef.path, staticSymbol.filePath, host);
        acc.push({ routeDef: routeDef, absoluteFilePath: absoluteFilePath });
        return acc;
    }, []);
    var importedSymbols = (moduleMetadata.imports || [])
        .filter(function (i) { return i instanceof compiler_1.StaticSymbol || i.ngModule instanceof compiler_1.StaticSymbol; })
        .map(function (i) {
        if (i instanceof compiler_1.StaticSymbol)
            return i;
        return i.ngModule;
    });
    return importedSymbols
        .reduce(function (acc, i) {
        return acc.concat(_extractLazyRoutesFromStaticModule(i, reflector, host, ROUTES));
    }, [])
        .concat(lazyRoutes);
}
/**
 * Get the NgModule Metadata of a symbol.
 * @private
 */
function _getNgModuleMetadata(staticSymbol, reflector) {
    var ngModules = reflector.annotations(staticSymbol).filter(function (s) { return s instanceof core_1.NgModule; });
    if (ngModules.length === 0) {
        throw new Error(staticSymbol.name + " is not an NgModule");
    }
    return ngModules[0];
}
/**
 * Return the routes from the provider list.
 * @private
 */
function _collectRoutes(providers, reflector, ROUTES) {
    return providers.reduce(function (routeList, p) {
        if (p.provide === ROUTES) {
            return routeList.concat(p.useValue);
        }
        else if (Array.isArray(p)) {
            return routeList.concat(_collectRoutes(p, reflector, ROUTES));
        }
        else {
            return routeList;
        }
    }, []);
}
/**
 * Return the loadChildren values of a list of Route.
 * @private
 */
function _collectLoadChildren(routes) {
    return routes.reduce(function (m, r) {
        if (r.loadChildren && typeof r.loadChildren === 'string') {
            return m.concat(r.loadChildren);
        }
        else if (Array.isArray(r)) {
            return m.concat(_collectLoadChildren(r));
        }
        else if (r.children) {
            return m.concat(_collectLoadChildren(r.children));
        }
        else {
            return m;
        }
    }, []);
}
//# sourceMappingURL=ngtools_impl.js.map
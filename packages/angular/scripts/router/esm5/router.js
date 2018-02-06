/**
 * @license Angular v6.0.0-beta.2-8c5c0dac1
 * (c) 2010-2018 Google, Inc. https://angular.io/
 * License: MIT
 */
import { APP_BASE_HREF, HashLocationStrategy, LOCATION_INITIALIZED, Location, LocationStrategy, PathLocationStrategy, PlatformLocation } from '@angular/common';
import { ANALYZE_FOR_ENTRY_COMPONENTS, APP_BOOTSTRAP_LISTENER, APP_INITIALIZER, ApplicationRef, Attribute, ChangeDetectorRef, Compiler, ComponentFactoryResolver, ContentChildren, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Inject, Injectable, InjectionToken, Injector, Input, NgModule, NgModuleFactory, NgModuleFactoryLoader, NgModuleRef, NgProbeToken, Optional, Output, Renderer2, SkipSelf, SystemJsNgModuleLoader, Version, ViewContainerRef, isDevMode, ɵisObservable, ɵisPromise } from '@angular/core';
import { __assign, __extends } from 'tslib';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { concatMap } from 'rxjs/operator/concatMap';
import { map } from 'rxjs/operator/map';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { _catch } from 'rxjs/operator/catch';
import { concatAll } from 'rxjs/operator/concatAll';
import { first } from 'rxjs/operator/first';
import { EmptyError } from 'rxjs/util/EmptyError';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { every } from 'rxjs/operator/every';
import { last } from 'rxjs/operator/last';
import { mergeAll } from 'rxjs/operator/mergeAll';
import { reduce } from 'rxjs/operator/reduce';
import { ɵgetDOM } from '@angular/platform-browser';
import { filter } from 'rxjs/operator/filter';

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
 * \@whatItDoes Base for events the Router goes through, as opposed to events tied to a specific
 * Route. `RouterEvent`s will only be fired one time for any given navigation.
 *
 * Example:
 *
 * ```
 * class MyService {
 *   constructor(public router: Router, logger: Logger) {
 *     router.events.filter(e => e instanceof RouterEvent).subscribe(e => {
 *       logger.log(e.id, e.url);
 *     });
 *   }
 * }
 * ```
 *
 * \@experimental
 */
var RouterEvent = /** @class */ (function () {
    function RouterEvent(id, url) {
        this.id = id;
        this.url = url;
    }
    return RouterEvent;
}());
/**
 * \@whatItDoes Represents an event triggered when a navigation starts.
 *
 * \@stable
 */
var NavigationStart = /** @class */ (function (_super) {
    __extends(NavigationStart, _super);
    function NavigationStart(/** @docsNotRequired */
        /** @docsNotRequired */
        id, /** @docsNotRequired */
        /** @docsNotRequired */
        url, /** @docsNotRequired */
        /** @docsNotRequired */
        navigationTrigger, /** @docsNotRequired */
        /** @docsNotRequired */
        restoredState) {
        /** @docsNotRequired */
        if (navigationTrigger === void 0) { navigationTrigger = 'imperative'; }
        /** @docsNotRequired */
        if (restoredState === void 0) { restoredState = null; }
        var _this = _super.call(this, id, url) || this;
        _this.navigationTrigger = navigationTrigger;
        _this.restoredState = restoredState;
        return _this;
    }
    /** @docsNotRequired */
    /**
     * \@docsNotRequired
     * @return {?}
     */
    NavigationStart.prototype.toString = /**
     * \@docsNotRequired
     * @return {?}
     */
    function () { return "NavigationStart(id: " + this.id + ", url: '" + this.url + "')"; };
    return NavigationStart;
}(RouterEvent));
/**
 * \@whatItDoes Represents an event triggered when a navigation ends successfully.
 *
 * \@stable
 */
var NavigationEnd = /** @class */ (function (_super) {
    __extends(NavigationEnd, _super);
    function NavigationEnd(/** @docsNotRequired */
        /** @docsNotRequired */
        id, /** @docsNotRequired */
        /** @docsNotRequired */
        url, urlAfterRedirects) {
        var _this = _super.call(this, id, url) || this;
        _this.urlAfterRedirects = urlAfterRedirects;
        return _this;
    }
    /** @docsNotRequired */
    /**
     * \@docsNotRequired
     * @return {?}
     */
    NavigationEnd.prototype.toString = /**
     * \@docsNotRequired
     * @return {?}
     */
    function () {
        return "NavigationEnd(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "')";
    };
    return NavigationEnd;
}(RouterEvent));
/**
 * \@whatItDoes Represents an event triggered when a navigation is canceled.
 *
 * \@stable
 */
var NavigationCancel = /** @class */ (function (_super) {
    __extends(NavigationCancel, _super);
    function NavigationCancel(/** @docsNotRequired */
        /** @docsNotRequired */
        id, /** @docsNotRequired */
        /** @docsNotRequired */
        url, reason) {
        var _this = _super.call(this, id, url) || this;
        _this.reason = reason;
        return _this;
    }
    /** @docsNotRequired */
    /**
     * \@docsNotRequired
     * @return {?}
     */
    NavigationCancel.prototype.toString = /**
     * \@docsNotRequired
     * @return {?}
     */
    function () { return "NavigationCancel(id: " + this.id + ", url: '" + this.url + "')"; };
    return NavigationCancel;
}(RouterEvent));
/**
 * \@whatItDoes Represents an event triggered when a navigation fails due to an unexpected error.
 *
 * \@stable
 */
var NavigationError = /** @class */ (function (_super) {
    __extends(NavigationError, _super);
    function NavigationError(/** @docsNotRequired */
        /** @docsNotRequired */
        id, /** @docsNotRequired */
        /** @docsNotRequired */
        url, error) {
        var _this = _super.call(this, id, url) || this;
        _this.error = error;
        return _this;
    }
    /** @docsNotRequired */
    /**
     * \@docsNotRequired
     * @return {?}
     */
    NavigationError.prototype.toString = /**
     * \@docsNotRequired
     * @return {?}
     */
    function () {
        return "NavigationError(id: " + this.id + ", url: '" + this.url + "', error: " + this.error + ")";
    };
    return NavigationError;
}(RouterEvent));
/**
 * \@whatItDoes Represents an event triggered when routes are recognized.
 *
 * \@stable
 */
var RoutesRecognized = /** @class */ (function (_super) {
    __extends(RoutesRecognized, _super);
    function RoutesRecognized(/** @docsNotRequired */
        /** @docsNotRequired */
        id, /** @docsNotRequired */
        /** @docsNotRequired */
        url, urlAfterRedirects, state) {
        var _this = _super.call(this, id, url) || this;
        _this.urlAfterRedirects = urlAfterRedirects;
        _this.state = state;
        return _this;
    }
    /** @docsNotRequired */
    /**
     * \@docsNotRequired
     * @return {?}
     */
    RoutesRecognized.prototype.toString = /**
     * \@docsNotRequired
     * @return {?}
     */
    function () {
        return "RoutesRecognized(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ")";
    };
    return RoutesRecognized;
}(RouterEvent));
/**
 * \@whatItDoes Represents the start of the Guard phase of routing.
 *
 * \@experimental
 */
var GuardsCheckStart = /** @class */ (function (_super) {
    __extends(GuardsCheckStart, _super);
    function GuardsCheckStart(/** @docsNotRequired */
        /** @docsNotRequired */
        id, /** @docsNotRequired */
        /** @docsNotRequired */
        url, urlAfterRedirects, state) {
        var _this = _super.call(this, id, url) || this;
        _this.urlAfterRedirects = urlAfterRedirects;
        _this.state = state;
        return _this;
    }
    /**
     * @return {?}
     */
    GuardsCheckStart.prototype.toString = /**
     * @return {?}
     */
    function () {
        return "GuardsCheckStart(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ")";
    };
    return GuardsCheckStart;
}(RouterEvent));
/**
 * \@whatItDoes Represents the end of the Guard phase of routing.
 *
 * \@experimental
 */
var GuardsCheckEnd = /** @class */ (function (_super) {
    __extends(GuardsCheckEnd, _super);
    function GuardsCheckEnd(/** @docsNotRequired */
        /** @docsNotRequired */
        id, /** @docsNotRequired */
        /** @docsNotRequired */
        url, urlAfterRedirects, state, shouldActivate) {
        var _this = _super.call(this, id, url) || this;
        _this.urlAfterRedirects = urlAfterRedirects;
        _this.state = state;
        _this.shouldActivate = shouldActivate;
        return _this;
    }
    /**
     * @return {?}
     */
    GuardsCheckEnd.prototype.toString = /**
     * @return {?}
     */
    function () {
        return "GuardsCheckEnd(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ", shouldActivate: " + this.shouldActivate + ")";
    };
    return GuardsCheckEnd;
}(RouterEvent));
/**
 * \@whatItDoes Represents the start of the Resolve phase of routing. The timing of this
 * event may change, thus it's experimental. In the current iteration it will run
 * in the "resolve" phase whether there's things to resolve or not. In the future this
 * behavior may change to only run when there are things to be resolved.
 *
 * \@experimental
 */
var ResolveStart = /** @class */ (function (_super) {
    __extends(ResolveStart, _super);
    function ResolveStart(/** @docsNotRequired */
        /** @docsNotRequired */
        id, /** @docsNotRequired */
        /** @docsNotRequired */
        url, urlAfterRedirects, state) {
        var _this = _super.call(this, id, url) || this;
        _this.urlAfterRedirects = urlAfterRedirects;
        _this.state = state;
        return _this;
    }
    /**
     * @return {?}
     */
    ResolveStart.prototype.toString = /**
     * @return {?}
     */
    function () {
        return "ResolveStart(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ")";
    };
    return ResolveStart;
}(RouterEvent));
/**
 * \@whatItDoes Represents the end of the Resolve phase of routing. See note on
 * {\@link ResolveStart} for use of this experimental API.
 *
 * \@experimental
 */
var ResolveEnd = /** @class */ (function (_super) {
    __extends(ResolveEnd, _super);
    function ResolveEnd(/** @docsNotRequired */
        /** @docsNotRequired */
        id, /** @docsNotRequired */
        /** @docsNotRequired */
        url, urlAfterRedirects, state) {
        var _this = _super.call(this, id, url) || this;
        _this.urlAfterRedirects = urlAfterRedirects;
        _this.state = state;
        return _this;
    }
    /**
     * @return {?}
     */
    ResolveEnd.prototype.toString = /**
     * @return {?}
     */
    function () {
        return "ResolveEnd(id: " + this.id + ", url: '" + this.url + "', urlAfterRedirects: '" + this.urlAfterRedirects + "', state: " + this.state + ")";
    };
    return ResolveEnd;
}(RouterEvent));
/**
 * \@whatItDoes Represents an event triggered before lazy loading a route config.
 *
 * \@experimental
 */
var RouteConfigLoadStart = /** @class */ (function () {
    function RouteConfigLoadStart(route) {
        this.route = route;
    }
    /**
     * @return {?}
     */
    RouteConfigLoadStart.prototype.toString = /**
     * @return {?}
     */
    function () { return "RouteConfigLoadStart(path: " + this.route.path + ")"; };
    return RouteConfigLoadStart;
}());
/**
 * \@whatItDoes Represents an event triggered when a route has been lazy loaded.
 *
 * \@experimental
 */
var RouteConfigLoadEnd = /** @class */ (function () {
    function RouteConfigLoadEnd(route) {
        this.route = route;
    }
    /**
     * @return {?}
     */
    RouteConfigLoadEnd.prototype.toString = /**
     * @return {?}
     */
    function () { return "RouteConfigLoadEnd(path: " + this.route.path + ")"; };
    return RouteConfigLoadEnd;
}());
/**
 * \@whatItDoes Represents the start of end of the Resolve phase of routing. See note on
 * {\@link ChildActivationEnd} for use of this experimental API.
 *
 * \@experimental
 */
var ChildActivationStart = /** @class */ (function () {
    function ChildActivationStart(snapshot) {
        this.snapshot = snapshot;
    }
    /**
     * @return {?}
     */
    ChildActivationStart.prototype.toString = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || '';
        return "ChildActivationStart(path: '" + path + "')";
    };
    return ChildActivationStart;
}());
/**
 * \@whatItDoes Represents the start of end of the Resolve phase of routing. See note on
 * {\@link ChildActivationStart} for use of this experimental API.
 *
 * \@experimental
 */
var ChildActivationEnd = /** @class */ (function () {
    function ChildActivationEnd(snapshot) {
        this.snapshot = snapshot;
    }
    /**
     * @return {?}
     */
    ChildActivationEnd.prototype.toString = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || '';
        return "ChildActivationEnd(path: '" + path + "')";
    };
    return ChildActivationEnd;
}());
/**
 * \@whatItDoes Represents the start of end of the Resolve phase of routing. See note on
 * {\@link ActivationEnd} for use of this experimental API.
 *
 * \@experimental
 */
var ActivationStart = /** @class */ (function () {
    function ActivationStart(snapshot) {
        this.snapshot = snapshot;
    }
    /**
     * @return {?}
     */
    ActivationStart.prototype.toString = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || '';
        return "ActivationStart(path: '" + path + "')";
    };
    return ActivationStart;
}());
/**
 * \@whatItDoes Represents the start of end of the Resolve phase of routing. See note on
 * {\@link ActivationStart} for use of this experimental API.
 *
 * \@experimental
 */
var ActivationEnd = /** @class */ (function () {
    function ActivationEnd(snapshot) {
        this.snapshot = snapshot;
    }
    /**
     * @return {?}
     */
    ActivationEnd.prototype.toString = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || '';
        return "ActivationEnd(path: '" + path + "')";
    };
    return ActivationEnd;
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
 * \@whatItDoes Name of the primary outlet.
 *
 * \@stable
 */
var PRIMARY_OUTLET = 'primary';
/**
 * Matrix and Query parameters.
 *
 * `ParamMap` makes it easier to work with parameters as they could have either a single value or
 * multiple value. Because this should be known by the user, calling `get` or `getAll` returns the
 * correct type (either `string` or `string[]`).
 *
 * The API is inspired by the URLSearchParams interface.
 * see https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
 *
 * \@stable
 * @record
 */

var ParamsAsMap = /** @class */ (function () {
    function ParamsAsMap(params) {
        this.params = params || {};
    }
    /**
     * @param {?} name
     * @return {?}
     */
    ParamsAsMap.prototype.has = /**
     * @param {?} name
     * @return {?}
     */
    function (name) { return this.params.hasOwnProperty(name); };
    /**
     * @param {?} name
     * @return {?}
     */
    ParamsAsMap.prototype.get = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        if (this.has(name)) {
            var /** @type {?} */ v = this.params[name];
            return Array.isArray(v) ? v[0] : v;
        }
        return null;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    ParamsAsMap.prototype.getAll = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        if (this.has(name)) {
            var /** @type {?} */ v = this.params[name];
            return Array.isArray(v) ? v : [v];
        }
        return [];
    };
    Object.defineProperty(ParamsAsMap.prototype, "keys", {
        get: /**
         * @return {?}
         */
        function () { return Object.keys(this.params); },
        enumerable: true,
        configurable: true
    });
    return ParamsAsMap;
}());
/**
 * Convert a {\@link Params} instance to a {\@link ParamMap}.
 *
 * \@stable
 * @param {?} params
 * @return {?}
 */
function convertToParamMap(params) {
    return new ParamsAsMap(params);
}
var NAVIGATION_CANCELING_ERROR = 'ngNavigationCancelingError';
/**
 * @param {?} message
 * @return {?}
 */
function navigationCancelingError(message) {
    var /** @type {?} */ error = Error('NavigationCancelingError: ' + message);
    (/** @type {?} */ (error))[NAVIGATION_CANCELING_ERROR] = true;
    return error;
}
/**
 * @param {?} error
 * @return {?}
 */
function isNavigationCancelingError(error) {
    return error && (/** @type {?} */ (error))[NAVIGATION_CANCELING_ERROR];
}
/**
 * @param {?} segments
 * @param {?} segmentGroup
 * @param {?} route
 * @return {?}
 */
function defaultUrlMatcher(segments, segmentGroup, route) {
    var /** @type {?} */ parts = /** @type {?} */ ((route.path)).split('/');
    if (parts.length > segments.length) {
        // The actual URL is shorter than the config, no match
        return null;
    }
    if (route.pathMatch === 'full' &&
        (segmentGroup.hasChildren() || parts.length < segments.length)) {
        // The config is longer than the actual URL but we are looking for a full match, return null
        return null;
    }
    var /** @type {?} */ posParams = {};
    // Check each config part against the actual URL
    for (var /** @type {?} */ index = 0; index < parts.length; index++) {
        var /** @type {?} */ part = parts[index];
        var /** @type {?} */ segment = segments[index];
        var /** @type {?} */ isParameter = part.startsWith(':');
        if (isParameter) {
            posParams[part.substring(1)] = segment;
        }
        else if (part !== segment.path) {
            // The actual URL part does not match the config, no match
            return null;
        }
    }
    return { consumed: segments.slice(0, parts.length), posParams: posParams };
}

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
 * See {\@link Routes} for more details.
 * \@stable
 * @record
 */

var LoadedRouterConfig = /** @class */ (function () {
    function LoadedRouterConfig(routes, module) {
        this.routes = routes;
        this.module = module;
    }
    return LoadedRouterConfig;
}());
/**
 * @param {?} config
 * @param {?=} parentPath
 * @return {?}
 */
function validateConfig(config, parentPath) {
    if (parentPath === void 0) { parentPath = ''; }
    // forEach doesn't iterate undefined values
    for (var /** @type {?} */ i = 0; i < config.length; i++) {
        var /** @type {?} */ route = config[i];
        var /** @type {?} */ fullPath = getFullPath(parentPath, route);
        validateNode(route, fullPath);
    }
}
/**
 * @param {?} route
 * @param {?} fullPath
 * @return {?}
 */
function validateNode(route, fullPath) {
    if (!route) {
        throw new Error("\n      Invalid configuration of route '" + fullPath + "': Encountered undefined route.\n      The reason might be an extra comma.\n\n      Example:\n      const routes: Routes = [\n        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },\n        { path: 'dashboard',  component: DashboardComponent },, << two commas\n        { path: 'detail/:id', component: HeroDetailComponent }\n      ];\n    ");
    }
    if (Array.isArray(route)) {
        throw new Error("Invalid configuration of route '" + fullPath + "': Array cannot be specified");
    }
    if (!route.component && (route.outlet && route.outlet !== PRIMARY_OUTLET)) {
        throw new Error("Invalid configuration of route '" + fullPath + "': a componentless route cannot have a named outlet set");
    }
    if (route.redirectTo && route.children) {
        throw new Error("Invalid configuration of route '" + fullPath + "': redirectTo and children cannot be used together");
    }
    if (route.redirectTo && route.loadChildren) {
        throw new Error("Invalid configuration of route '" + fullPath + "': redirectTo and loadChildren cannot be used together");
    }
    if (route.children && route.loadChildren) {
        throw new Error("Invalid configuration of route '" + fullPath + "': children and loadChildren cannot be used together");
    }
    if (route.redirectTo && route.component) {
        throw new Error("Invalid configuration of route '" + fullPath + "': redirectTo and component cannot be used together");
    }
    if (route.path && route.matcher) {
        throw new Error("Invalid configuration of route '" + fullPath + "': path and matcher cannot be used together");
    }
    if (route.redirectTo === void 0 && !route.component && !route.children && !route.loadChildren) {
        throw new Error("Invalid configuration of route '" + fullPath + "'. One of the following must be provided: component, redirectTo, children or loadChildren");
    }
    if (route.path === void 0 && route.matcher === void 0) {
        throw new Error("Invalid configuration of route '" + fullPath + "': routes must have either a path or a matcher specified");
    }
    if (typeof route.path === 'string' && route.path.charAt(0) === '/') {
        throw new Error("Invalid configuration of route '" + fullPath + "': path cannot start with a slash");
    }
    if (route.path === '' && route.redirectTo !== void 0 && route.pathMatch === void 0) {
        var /** @type {?} */ exp = "The default value of 'pathMatch' is 'prefix', but often the intent is to use 'full'.";
        throw new Error("Invalid configuration of route '{path: \"" + fullPath + "\", redirectTo: \"" + route.redirectTo + "\"}': please provide 'pathMatch'. " + exp);
    }
    if (route.pathMatch !== void 0 && route.pathMatch !== 'full' && route.pathMatch !== 'prefix') {
        throw new Error("Invalid configuration of route '" + fullPath + "': pathMatch can only be set to 'prefix' or 'full'");
    }
    if (route.children) {
        validateConfig(route.children, fullPath);
    }
}
/**
 * @param {?} parentPath
 * @param {?} currentRoute
 * @return {?}
 */
function getFullPath(parentPath, currentRoute) {
    if (!currentRoute) {
        return parentPath;
    }
    if (!parentPath && !currentRoute.path) {
        return '';
    }
    else if (parentPath && !currentRoute.path) {
        return parentPath + "/";
    }
    else if (!parentPath && currentRoute.path) {
        return currentRoute.path;
    }
    else {
        return parentPath + "/" + currentRoute.path;
    }
}

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
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function shallowEqualArrays(a, b) {
    if (a.length !== b.length)
        return false;
    for (var /** @type {?} */ i = 0; i < a.length; ++i) {
        if (!shallowEqual(a[i], b[i]))
            return false;
    }
    return true;
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function shallowEqual(a, b) {
    var /** @type {?} */ k1 = Object.keys(a);
    var /** @type {?} */ k2 = Object.keys(b);
    if (k1.length != k2.length) {
        return false;
    }
    var /** @type {?} */ key;
    for (var /** @type {?} */ i = 0; i < k1.length; i++) {
        key = k1[i];
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}
/**
 * Flattens single-level nested arrays.
 * @template T
 * @param {?} arr
 * @return {?}
 */
function flatten(arr) {
    return Array.prototype.concat.apply([], arr);
}
/**
 * Return the last element of an array.
 * @template T
 * @param {?} a
 * @return {?}
 */
function last$1(a) {
    return a.length > 0 ? a[a.length - 1] : null;
}
/**
 * Verifys all booleans in an array are `true`.
 * @param {?} bools
 * @return {?}
 */

/**
 * @template K, V
 * @param {?} map
 * @param {?} callback
 * @return {?}
 */
function forEach(map$$1, callback) {
    for (var /** @type {?} */ prop in map$$1) {
        if (map$$1.hasOwnProperty(prop)) {
            callback(map$$1[prop], prop);
        }
    }
}
/**
 * @template A, B
 * @param {?} obj
 * @param {?} fn
 * @return {?}
 */
function waitForMap(obj, fn) {
    if (Object.keys(obj).length === 0) {
        return of({});
    }
    var /** @type {?} */ waitHead = [];
    var /** @type {?} */ waitTail = [];
    var /** @type {?} */ res = {};
    forEach(obj, function (a, k) {
        var /** @type {?} */ mapped = map.call(fn(k, a), function (r) { return res[k] = r; });
        if (k === PRIMARY_OUTLET) {
            waitHead.push(mapped);
        }
        else {
            waitTail.push(mapped);
        }
    });
    var /** @type {?} */ concat$ = concatAll.call(of.apply(void 0, waitHead.concat(waitTail)));
    var /** @type {?} */ last$ = last.call(concat$);
    return map.call(last$, function () { return res; });
}
/**
 * ANDs Observables by merging all input observables, reducing to an Observable verifying all
 * input Observables return `true`.
 * @param {?} observables
 * @return {?}
 */
function andObservables(observables) {
    var /** @type {?} */ merged$ = mergeAll.call(observables);
    return every.call(merged$, function (result) { return result === true; });
}
/**
 * @template T
 * @param {?} value
 * @return {?}
 */
function wrapIntoObservable(value) {
    if (ɵisObservable(value)) {
        return value;
    }
    if (ɵisPromise(value)) {
        // Use `Promise.resolve()` to wrap promise-like instances.
        // Required ie when a Resolver returns a AngularJS `$q` promise to correctly trigger the
        // change detection.
        return fromPromise(Promise.resolve(value));
    }
    return of(/** @type {?} */ (value));
}

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
 * @return {?}
 */
function createEmptyUrlTree() {
    return new UrlTree(new UrlSegmentGroup([], {}), {}, null);
}
/**
 * @param {?} container
 * @param {?} containee
 * @param {?} exact
 * @return {?}
 */
function containsTree(container, containee, exact) {
    if (exact) {
        return equalQueryParams(container.queryParams, containee.queryParams) &&
            equalSegmentGroups(container.root, containee.root);
    }
    return containsQueryParams(container.queryParams, containee.queryParams) &&
        containsSegmentGroup(container.root, containee.root);
}
/**
 * @param {?} container
 * @param {?} containee
 * @return {?}
 */
function equalQueryParams(container, containee) {
    return shallowEqual(container, containee);
}
/**
 * @param {?} container
 * @param {?} containee
 * @return {?}
 */
function equalSegmentGroups(container, containee) {
    if (!equalPath(container.segments, containee.segments))
        return false;
    if (container.numberOfChildren !== containee.numberOfChildren)
        return false;
    for (var /** @type {?} */ c in containee.children) {
        if (!container.children[c])
            return false;
        if (!equalSegmentGroups(container.children[c], containee.children[c]))
            return false;
    }
    return true;
}
/**
 * @param {?} container
 * @param {?} containee
 * @return {?}
 */
function containsQueryParams(container, containee) {
    return Object.keys(containee).length <= Object.keys(container).length &&
        Object.keys(containee).every(function (key) { return containee[key] === container[key]; });
}
/**
 * @param {?} container
 * @param {?} containee
 * @return {?}
 */
function containsSegmentGroup(container, containee) {
    return containsSegmentGroupHelper(container, containee, containee.segments);
}
/**
 * @param {?} container
 * @param {?} containee
 * @param {?} containeePaths
 * @return {?}
 */
function containsSegmentGroupHelper(container, containee, containeePaths) {
    if (container.segments.length > containeePaths.length) {
        var /** @type {?} */ current = container.segments.slice(0, containeePaths.length);
        if (!equalPath(current, containeePaths))
            return false;
        if (containee.hasChildren())
            return false;
        return true;
    }
    else if (container.segments.length === containeePaths.length) {
        if (!equalPath(container.segments, containeePaths))
            return false;
        for (var /** @type {?} */ c in containee.children) {
            if (!container.children[c])
                return false;
            if (!containsSegmentGroup(container.children[c], containee.children[c]))
                return false;
        }
        return true;
    }
    else {
        var /** @type {?} */ current = containeePaths.slice(0, container.segments.length);
        var /** @type {?} */ next = containeePaths.slice(container.segments.length);
        if (!equalPath(container.segments, current))
            return false;
        if (!container.children[PRIMARY_OUTLET])
            return false;
        return containsSegmentGroupHelper(container.children[PRIMARY_OUTLET], containee, next);
    }
}
/**
 * \@whatItDoes Represents the parsed URL.
 *
 * \@howToUse
 *
 * ```
 * \@Component({templateUrl:'template.html'})
 * class MyComponent {
 *   constructor(router: Router) {
 *     const tree: UrlTree =
 *       router.parseUrl('/team/33/(user/victor//support:help)?debug=true#fragment');
 *     const f = tree.fragment; // return 'fragment'
 *     const q = tree.queryParams; // returns {debug: 'true'}
 *     const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
 *     const s: UrlSegment[] = g.segments; // returns 2 segments 'team' and '33'
 *     g.children[PRIMARY_OUTLET].segments; // returns 2 segments 'user' and 'victor'
 *     g.children['support'].segments; // return 1 segment 'help'
 *   }
 * }
 * ```
 *
 * \@description
 *
 * Since a router state is a tree, and the URL is nothing but a serialized state, the URL is a
 * serialized tree.
 * UrlTree is a data structure that provides a lot of affordances in dealing with URLs
 *
 * \@stable
 */
var UrlTree = /** @class */ (function () {
    /** @internal */
    function UrlTree(root, queryParams, fragment) {
        this.root = root;
        this.queryParams = queryParams;
        this.fragment = fragment;
    }
    Object.defineProperty(UrlTree.prototype, "queryParamMap", {
        get: /**
         * @return {?}
         */
        function () {
            if (!this._queryParamMap) {
                this._queryParamMap = convertToParamMap(this.queryParams);
            }
            return this._queryParamMap;
        },
        enumerable: true,
        configurable: true
    });
    /** @docsNotRequired */
    /**
     * \@docsNotRequired
     * @return {?}
     */
    UrlTree.prototype.toString = /**
     * \@docsNotRequired
     * @return {?}
     */
    function () { return DEFAULT_SERIALIZER.serialize(this); };
    return UrlTree;
}());
/**
 * \@whatItDoes Represents the parsed URL segment group.
 *
 * See {\@link UrlTree} for more information.
 *
 * \@stable
 */
var UrlSegmentGroup = /** @class */ (function () {
    function UrlSegmentGroup(segments, children) {
        var _this = this;
        this.segments = segments;
        this.children = children;
        /**
         * The parent node in the url tree
         */
        this.parent = null;
        forEach(children, function (v, k) { return v.parent = _this; });
    }
    /** Whether the segment has child segments */
    /**
     * Whether the segment has child segments
     * @return {?}
     */
    UrlSegmentGroup.prototype.hasChildren = /**
     * Whether the segment has child segments
     * @return {?}
     */
    function () { return this.numberOfChildren > 0; };
    Object.defineProperty(UrlSegmentGroup.prototype, "numberOfChildren", {
        /** Number of child segments */
        get: /**
         * Number of child segments
         * @return {?}
         */
        function () { return Object.keys(this.children).length; },
        enumerable: true,
        configurable: true
    });
    /** @docsNotRequired */
    /**
     * \@docsNotRequired
     * @return {?}
     */
    UrlSegmentGroup.prototype.toString = /**
     * \@docsNotRequired
     * @return {?}
     */
    function () { return serializePaths(this); };
    return UrlSegmentGroup;
}());
/**
 * \@whatItDoes Represents a single URL segment.
 *
 * \@howToUse
 *
 * ```
 * \@Component({templateUrl:'template.html'})
 * class MyComponent {
 *   constructor(router: Router) {
 *     const tree: UrlTree = router.parseUrl('/team;id=33');
 *     const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
 *     const s: UrlSegment[] = g.segments;
 *     s[0].path; // returns 'team'
 *     s[0].parameters; // returns {id: 33}
 *   }
 * }
 * ```
 *
 * \@description
 *
 * A UrlSegment is a part of a URL between the two slashes. It contains a path and the matrix
 * parameters associated with the segment.
 *
 * \@stable
 */
var UrlSegment = /** @class */ (function () {
    function UrlSegment(path, parameters) {
        this.path = path;
        this.parameters = parameters;
    }
    Object.defineProperty(UrlSegment.prototype, "parameterMap", {
        get: /**
         * @return {?}
         */
        function () {
            if (!this._parameterMap) {
                this._parameterMap = convertToParamMap(this.parameters);
            }
            return this._parameterMap;
        },
        enumerable: true,
        configurable: true
    });
    /** @docsNotRequired */
    /**
     * \@docsNotRequired
     * @return {?}
     */
    UrlSegment.prototype.toString = /**
     * \@docsNotRequired
     * @return {?}
     */
    function () { return serializePath(this); };
    return UrlSegment;
}());
/**
 * @param {?} as
 * @param {?} bs
 * @return {?}
 */
function equalSegments(as, bs) {
    return equalPath(as, bs) && as.every(function (a, i) { return shallowEqual(a.parameters, bs[i].parameters); });
}
/**
 * @param {?} as
 * @param {?} bs
 * @return {?}
 */
function equalPath(as, bs) {
    if (as.length !== bs.length)
        return false;
    return as.every(function (a, i) { return a.path === bs[i].path; });
}
/**
 * @template T
 * @param {?} segment
 * @param {?} fn
 * @return {?}
 */
function mapChildrenIntoArray(segment, fn) {
    var /** @type {?} */ res = [];
    forEach(segment.children, function (child, childOutlet) {
        if (childOutlet === PRIMARY_OUTLET) {
            res = res.concat(fn(child, childOutlet));
        }
    });
    forEach(segment.children, function (child, childOutlet) {
        if (childOutlet !== PRIMARY_OUTLET) {
            res = res.concat(fn(child, childOutlet));
        }
    });
    return res;
}
/**
 * \@whatItDoes Serializes and deserializes a URL string into a URL tree.
 *
 * \@description The url serialization strategy is customizable. You can
 * make all URLs case insensitive by providing a custom UrlSerializer.
 *
 * See {\@link DefaultUrlSerializer} for an example of a URL serializer.
 *
 * \@stable
 * @abstract
 */
var UrlSerializer = /** @class */ (function () {
    function UrlSerializer() {
    }
    return UrlSerializer;
}());
/**
 * \@whatItDoes A default implementation of the {\@link UrlSerializer}.
 *
 * \@description
 *
 * Example URLs:
 *
 * ```
 * /inbox/33(popup:compose)
 * /inbox/33;open=true/messages/44
 * ```
 *
 * DefaultUrlSerializer uses parentheses to serialize secondary segments (e.g., popup:compose), the
 * colon syntax to specify the outlet, and the ';parameter=value' syntax (e.g., open=true) to
 * specify route specific parameters.
 *
 * \@stable
 */
var DefaultUrlSerializer = /** @class */ (function () {
    function DefaultUrlSerializer() {
    }
    /** Parses a url into a {@link UrlTree} */
    /**
     * Parses a url into a {\@link UrlTree}
     * @param {?} url
     * @return {?}
     */
    DefaultUrlSerializer.prototype.parse = /**
     * Parses a url into a {\@link UrlTree}
     * @param {?} url
     * @return {?}
     */
    function (url) {
        var /** @type {?} */ p = new UrlParser(url);
        return new UrlTree(p.parseRootSegment(), p.parseQueryParams(), p.parseFragment());
    };
    /** Converts a {@link UrlTree} into a url */
    /**
     * Converts a {\@link UrlTree} into a url
     * @param {?} tree
     * @return {?}
     */
    DefaultUrlSerializer.prototype.serialize = /**
     * Converts a {\@link UrlTree} into a url
     * @param {?} tree
     * @return {?}
     */
    function (tree) {
        var /** @type {?} */ segment = "/" + serializeSegment(tree.root, true);
        var /** @type {?} */ query = serializeQueryParams(tree.queryParams);
        var /** @type {?} */ fragment = typeof tree.fragment === "string" ? "#" + encodeURI((/** @type {?} */ ((tree.fragment)))) : '';
        return "" + segment + query + fragment;
    };
    return DefaultUrlSerializer;
}());
var DEFAULT_SERIALIZER = new DefaultUrlSerializer();
/**
 * @param {?} segment
 * @return {?}
 */
function serializePaths(segment) {
    return segment.segments.map(function (p) { return serializePath(p); }).join('/');
}
/**
 * @param {?} segment
 * @param {?} root
 * @return {?}
 */
function serializeSegment(segment, root) {
    if (!segment.hasChildren()) {
        return serializePaths(segment);
    }
    if (root) {
        var /** @type {?} */ primary = segment.children[PRIMARY_OUTLET] ?
            serializeSegment(segment.children[PRIMARY_OUTLET], false) :
            '';
        var /** @type {?} */ children_1 = [];
        forEach(segment.children, function (v, k) {
            if (k !== PRIMARY_OUTLET) {
                children_1.push(k + ":" + serializeSegment(v, false));
            }
        });
        return children_1.length > 0 ? primary + "(" + children_1.join('//') + ")" : primary;
    }
    else {
        var /** @type {?} */ children = mapChildrenIntoArray(segment, function (v, k) {
            if (k === PRIMARY_OUTLET) {
                return [serializeSegment(segment.children[PRIMARY_OUTLET], false)];
            }
            return [k + ":" + serializeSegment(v, false)];
        });
        return serializePaths(segment) + "/(" + children.join('//') + ")";
    }
}
/**
 * This method is intended for encoding *key* or *value* parts of query component. We need a custom
 * method because encodeURIComponent is too aggressive and encodes stuff that doesn't have to be
 * encoded per http://tools.ietf.org/html/rfc3986:
 *    query         = *( pchar / "/" / "?" )
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "\@"
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 * @param {?} s
 * @return {?}
 */
function encode(s) {
    return encodeURIComponent(s)
        .replace(/%40/g, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%3B/gi, ';');
}
/**
 * @param {?} s
 * @return {?}
 */
function decode(s) {
    return decodeURIComponent(s);
}
/**
 * @param {?} path
 * @return {?}
 */
function serializePath(path) {
    return "" + encode(path.path) + serializeParams(path.parameters);
}
/**
 * @param {?} params
 * @return {?}
 */
function serializeParams(params) {
    return Object.keys(params).map(function (key) { return ";" + encode(key) + "=" + encode(params[key]); }).join('');
}
/**
 * @param {?} params
 * @return {?}
 */
function serializeQueryParams(params) {
    var /** @type {?} */ strParams = Object.keys(params).map(function (name) {
        var /** @type {?} */ value = params[name];
        return Array.isArray(value) ? value.map(function (v) { return encode(name) + "=" + encode(v); }).join('&') :
            encode(name) + "=" + encode(value);
    });
    return strParams.length ? "?" + strParams.join("&") : '';
}
var SEGMENT_RE = /^[^\/()?;=&#]+/;
/**
 * @param {?} str
 * @return {?}
 */
function matchSegments(str) {
    var /** @type {?} */ match = str.match(SEGMENT_RE);
    return match ? match[0] : '';
}
var QUERY_PARAM_RE = /^[^=?&#]+/;
/**
 * @param {?} str
 * @return {?}
 */
function matchQueryParams(str) {
    var /** @type {?} */ match = str.match(QUERY_PARAM_RE);
    return match ? match[0] : '';
}
var QUERY_PARAM_VALUE_RE = /^[^?&#]+/;
/**
 * @param {?} str
 * @return {?}
 */
function matchUrlQueryParamValue(str) {
    var /** @type {?} */ match = str.match(QUERY_PARAM_VALUE_RE);
    return match ? match[0] : '';
}
var UrlParser = /** @class */ (function () {
    function UrlParser(url) {
        this.url = url;
        this.remaining = url;
    }
    /**
     * @return {?}
     */
    UrlParser.prototype.parseRootSegment = /**
     * @return {?}
     */
    function () {
        this.consumeOptional('/');
        if (this.remaining === '' || this.peekStartsWith('?') || this.peekStartsWith('#')) {
            return new UrlSegmentGroup([], {});
        }
        // The root segment group never has segments
        return new UrlSegmentGroup([], this.parseChildren());
    };
    /**
     * @return {?}
     */
    UrlParser.prototype.parseQueryParams = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ params = {};
        if (this.consumeOptional('?')) {
            do {
                this.parseQueryParam(params);
            } while (this.consumeOptional('&'));
        }
        return params;
    };
    /**
     * @return {?}
     */
    UrlParser.prototype.parseFragment = /**
     * @return {?}
     */
    function () {
        return this.consumeOptional('#') ? decodeURI(this.remaining) : null;
    };
    /**
     * @return {?}
     */
    UrlParser.prototype.parseChildren = /**
     * @return {?}
     */
    function () {
        if (this.remaining === '') {
            return {};
        }
        this.consumeOptional('/');
        var /** @type {?} */ segments = [];
        if (!this.peekStartsWith('(')) {
            segments.push(this.parseSegment());
        }
        while (this.peekStartsWith('/') && !this.peekStartsWith('//') && !this.peekStartsWith('/(')) {
            this.capture('/');
            segments.push(this.parseSegment());
        }
        var /** @type {?} */ children = {};
        if (this.peekStartsWith('/(')) {
            this.capture('/');
            children = this.parseParens(true);
        }
        var /** @type {?} */ res = {};
        if (this.peekStartsWith('(')) {
            res = this.parseParens(false);
        }
        if (segments.length > 0 || Object.keys(children).length > 0) {
            res[PRIMARY_OUTLET] = new UrlSegmentGroup(segments, children);
        }
        return res;
    };
    /**
     * @return {?}
     */
    UrlParser.prototype.parseSegment = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ path = matchSegments(this.remaining);
        if (path === '' && this.peekStartsWith(';')) {
            throw new Error("Empty path url segment cannot have parameters: '" + this.remaining + "'.");
        }
        this.capture(path);
        return new UrlSegment(decode(path), this.parseMatrixParams());
    };
    /**
     * @return {?}
     */
    UrlParser.prototype.parseMatrixParams = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ params = {};
        while (this.consumeOptional(';')) {
            this.parseParam(params);
        }
        return params;
    };
    /**
     * @param {?} params
     * @return {?}
     */
    UrlParser.prototype.parseParam = /**
     * @param {?} params
     * @return {?}
     */
    function (params) {
        var /** @type {?} */ key = matchSegments(this.remaining);
        if (!key) {
            return;
        }
        this.capture(key);
        var /** @type {?} */ value = '';
        if (this.consumeOptional('=')) {
            var /** @type {?} */ valueMatch = matchSegments(this.remaining);
            if (valueMatch) {
                value = valueMatch;
                this.capture(value);
            }
        }
        params[decode(key)] = decode(value);
    };
    /**
     * @param {?} params
     * @return {?}
     */
    UrlParser.prototype.parseQueryParam = /**
     * @param {?} params
     * @return {?}
     */
    function (params) {
        var /** @type {?} */ key = matchQueryParams(this.remaining);
        if (!key) {
            return;
        }
        this.capture(key);
        var /** @type {?} */ value = '';
        if (this.consumeOptional('=')) {
            var /** @type {?} */ valueMatch = matchUrlQueryParamValue(this.remaining);
            if (valueMatch) {
                value = valueMatch;
                this.capture(value);
            }
        }
        var /** @type {?} */ decodedKey = decode(key);
        var /** @type {?} */ decodedVal = decode(value);
        if (params.hasOwnProperty(decodedKey)) {
            // Append to existing values
            var /** @type {?} */ currentVal = params[decodedKey];
            if (!Array.isArray(currentVal)) {
                currentVal = [currentVal];
                params[decodedKey] = currentVal;
            }
            currentVal.push(decodedVal);
        }
        else {
            // Create a new value
            params[decodedKey] = decodedVal;
        }
    };
    /**
     * @param {?} allowPrimary
     * @return {?}
     */
    UrlParser.prototype.parseParens = /**
     * @param {?} allowPrimary
     * @return {?}
     */
    function (allowPrimary) {
        var /** @type {?} */ segments = {};
        this.capture('(');
        while (!this.consumeOptional(')') && this.remaining.length > 0) {
            var /** @type {?} */ path = matchSegments(this.remaining);
            var /** @type {?} */ next = this.remaining[path.length];
            // if is is not one of these characters, then the segment was unescaped
            // or the group was not closed
            if (next !== '/' && next !== ')' && next !== ';') {
                throw new Error("Cannot parse url '" + this.url + "'");
            }
            var /** @type {?} */ outletName = /** @type {?} */ ((undefined));
            if (path.indexOf(':') > -1) {
                outletName = path.substr(0, path.indexOf(':'));
                this.capture(outletName);
                this.capture(':');
            }
            else if (allowPrimary) {
                outletName = PRIMARY_OUTLET;
            }
            var /** @type {?} */ children = this.parseChildren();
            segments[outletName] = Object.keys(children).length === 1 ? children[PRIMARY_OUTLET] :
                new UrlSegmentGroup([], children);
            this.consumeOptional('//');
        }
        return segments;
    };
    /**
     * @param {?} str
     * @return {?}
     */
    UrlParser.prototype.peekStartsWith = /**
     * @param {?} str
     * @return {?}
     */
    function (str) { return this.remaining.startsWith(str); };
    /**
     * @param {?} str
     * @return {?}
     */
    UrlParser.prototype.consumeOptional = /**
     * @param {?} str
     * @return {?}
     */
    function (str) {
        if (this.peekStartsWith(str)) {
            this.remaining = this.remaining.substring(str.length);
            return true;
        }
        return false;
    };
    /**
     * @param {?} str
     * @return {?}
     */
    UrlParser.prototype.capture = /**
     * @param {?} str
     * @return {?}
     */
    function (str) {
        if (!this.consumeOptional(str)) {
            throw new Error("Expected \"" + str + "\".");
        }
    };
    return UrlParser;
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
var NoMatch = /** @class */ (function () {
    function NoMatch(segmentGroup) {
        this.segmentGroup = segmentGroup || null;
    }
    return NoMatch;
}());
var AbsoluteRedirect = /** @class */ (function () {
    function AbsoluteRedirect(urlTree) {
        this.urlTree = urlTree;
    }
    return AbsoluteRedirect;
}());
/**
 * @param {?} segmentGroup
 * @return {?}
 */
function noMatch(segmentGroup) {
    return new Observable(function (obs) { return obs.error(new NoMatch(segmentGroup)); });
}
/**
 * @param {?} newTree
 * @return {?}
 */
function absoluteRedirect(newTree) {
    return new Observable(function (obs) { return obs.error(new AbsoluteRedirect(newTree)); });
}
/**
 * @param {?} redirectTo
 * @return {?}
 */
function namedOutletsRedirect(redirectTo) {
    return new Observable(function (obs) {
        return obs.error(new Error("Only absolute redirects can have named outlets. redirectTo: '" + redirectTo + "'"));
    });
}
/**
 * @param {?} route
 * @return {?}
 */
function canLoadFails(route) {
    return new Observable(function (obs) {
        return obs.error(navigationCancelingError("Cannot load children because the guard of the route \"path: '" + route.path + "'\" returned false"));
    });
}
/**
 * Returns the `UrlTree` with the redirection applied.
 *
 * Lazy modules are loaded along the way.
 * @param {?} moduleInjector
 * @param {?} configLoader
 * @param {?} urlSerializer
 * @param {?} urlTree
 * @param {?} config
 * @return {?}
 */
function applyRedirects(moduleInjector, configLoader, urlSerializer, urlTree, config) {
    return new ApplyRedirects(moduleInjector, configLoader, urlSerializer, urlTree, config).apply();
}
var ApplyRedirects = /** @class */ (function () {
    function ApplyRedirects(moduleInjector, configLoader, urlSerializer, urlTree, config) {
        this.configLoader = configLoader;
        this.urlSerializer = urlSerializer;
        this.urlTree = urlTree;
        this.config = config;
        this.allowRedirects = true;
        this.ngModule = moduleInjector.get(NgModuleRef);
    }
    /**
     * @return {?}
     */
    ApplyRedirects.prototype.apply = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ expanded$ = this.expandSegmentGroup(this.ngModule, this.config, this.urlTree.root, PRIMARY_OUTLET);
        var /** @type {?} */ urlTrees$ = map.call(expanded$, function (rootSegmentGroup) {
            return _this.createUrlTree(rootSegmentGroup, _this.urlTree.queryParams, /** @type {?} */ ((_this.urlTree.fragment)));
        });
        return _catch.call(urlTrees$, function (e) {
            if (e instanceof AbsoluteRedirect) {
                // after an absolute redirect we do not apply any more redirects!
                // after an absolute redirect we do not apply any more redirects!
                _this.allowRedirects = false;
                // we need to run matching, so we can fetch all lazy-loaded modules
                return _this.match(e.urlTree);
            }
            if (e instanceof NoMatch) {
                throw _this.noMatchError(e);
            }
            throw e;
        });
    };
    /**
     * @param {?} tree
     * @return {?}
     */
    ApplyRedirects.prototype.match = /**
     * @param {?} tree
     * @return {?}
     */
    function (tree) {
        var _this = this;
        var /** @type {?} */ expanded$ = this.expandSegmentGroup(this.ngModule, this.config, tree.root, PRIMARY_OUTLET);
        var /** @type {?} */ mapped$ = map.call(expanded$, function (rootSegmentGroup) {
            return _this.createUrlTree(rootSegmentGroup, tree.queryParams, /** @type {?} */ ((tree.fragment)));
        });
        return _catch.call(mapped$, function (e) {
            if (e instanceof NoMatch) {
                throw _this.noMatchError(e);
            }
            throw e;
        });
    };
    /**
     * @param {?} e
     * @return {?}
     */
    ApplyRedirects.prototype.noMatchError = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        return new Error("Cannot match any routes. URL Segment: '" + e.segmentGroup + "'");
    };
    /**
     * @param {?} rootCandidate
     * @param {?} queryParams
     * @param {?} fragment
     * @return {?}
     */
    ApplyRedirects.prototype.createUrlTree = /**
     * @param {?} rootCandidate
     * @param {?} queryParams
     * @param {?} fragment
     * @return {?}
     */
    function (rootCandidate, queryParams, fragment) {
        var /** @type {?} */ root = rootCandidate.segments.length > 0 ?
            new UrlSegmentGroup([], (_a = {}, _a[PRIMARY_OUTLET] = rootCandidate, _a)) :
            rootCandidate;
        return new UrlTree(root, queryParams, fragment);
        var _a;
    };
    /**
     * @param {?} ngModule
     * @param {?} routes
     * @param {?} segmentGroup
     * @param {?} outlet
     * @return {?}
     */
    ApplyRedirects.prototype.expandSegmentGroup = /**
     * @param {?} ngModule
     * @param {?} routes
     * @param {?} segmentGroup
     * @param {?} outlet
     * @return {?}
     */
    function (ngModule, routes, segmentGroup, outlet) {
        if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
            return map.call(this.expandChildren(ngModule, routes, segmentGroup), function (children) { return new UrlSegmentGroup([], children); });
        }
        return this.expandSegment(ngModule, segmentGroup, routes, segmentGroup.segments, outlet, true);
    };
    /**
     * @param {?} ngModule
     * @param {?} routes
     * @param {?} segmentGroup
     * @return {?}
     */
    ApplyRedirects.prototype.expandChildren = /**
     * @param {?} ngModule
     * @param {?} routes
     * @param {?} segmentGroup
     * @return {?}
     */
    function (ngModule, routes, segmentGroup) {
        var _this = this;
        return waitForMap(segmentGroup.children, function (childOutlet, child) { return _this.expandSegmentGroup(ngModule, routes, child, childOutlet); });
    };
    /**
     * @param {?} ngModule
     * @param {?} segmentGroup
     * @param {?} routes
     * @param {?} segments
     * @param {?} outlet
     * @param {?} allowRedirects
     * @return {?}
     */
    ApplyRedirects.prototype.expandSegment = /**
     * @param {?} ngModule
     * @param {?} segmentGroup
     * @param {?} routes
     * @param {?} segments
     * @param {?} outlet
     * @param {?} allowRedirects
     * @return {?}
     */
    function (ngModule, segmentGroup, routes, segments, outlet, allowRedirects) {
        var _this = this;
        var /** @type {?} */ routes$ = of.apply(void 0, routes);
        var /** @type {?} */ processedRoutes$ = map.call(routes$, function (r) {
            var /** @type {?} */ expanded$ = _this.expandSegmentAgainstRoute(ngModule, segmentGroup, routes, r, segments, outlet, allowRedirects);
            return _catch.call(expanded$, function (e) {
                if (e instanceof NoMatch) {
                    return of(null);
                }
                throw e;
            });
        });
        var /** @type {?} */ concattedProcessedRoutes$ = concatAll.call(processedRoutes$);
        var /** @type {?} */ first$ = first.call(concattedProcessedRoutes$, function (s) { return !!s; });
        return _catch.call(first$, function (e, _) {
            if (e instanceof EmptyError || e.name === 'EmptyError') {
                if (_this.noLeftoversInUrl(segmentGroup, segments, outlet)) {
                    return of(new UrlSegmentGroup([], {}));
                }
                throw new NoMatch(segmentGroup);
            }
            throw e;
        });
    };
    /**
     * @param {?} segmentGroup
     * @param {?} segments
     * @param {?} outlet
     * @return {?}
     */
    ApplyRedirects.prototype.noLeftoversInUrl = /**
     * @param {?} segmentGroup
     * @param {?} segments
     * @param {?} outlet
     * @return {?}
     */
    function (segmentGroup, segments, outlet) {
        return segments.length === 0 && !segmentGroup.children[outlet];
    };
    /**
     * @param {?} ngModule
     * @param {?} segmentGroup
     * @param {?} routes
     * @param {?} route
     * @param {?} paths
     * @param {?} outlet
     * @param {?} allowRedirects
     * @return {?}
     */
    ApplyRedirects.prototype.expandSegmentAgainstRoute = /**
     * @param {?} ngModule
     * @param {?} segmentGroup
     * @param {?} routes
     * @param {?} route
     * @param {?} paths
     * @param {?} outlet
     * @param {?} allowRedirects
     * @return {?}
     */
    function (ngModule, segmentGroup, routes, route, paths, outlet, allowRedirects) {
        if (getOutlet(route) !== outlet) {
            return noMatch(segmentGroup);
        }
        if (route.redirectTo === undefined) {
            return this.matchSegmentAgainstRoute(ngModule, segmentGroup, route, paths);
        }
        if (allowRedirects && this.allowRedirects) {
            return this.expandSegmentAgainstRouteUsingRedirect(ngModule, segmentGroup, routes, route, paths, outlet);
        }
        return noMatch(segmentGroup);
    };
    /**
     * @param {?} ngModule
     * @param {?} segmentGroup
     * @param {?} routes
     * @param {?} route
     * @param {?} segments
     * @param {?} outlet
     * @return {?}
     */
    ApplyRedirects.prototype.expandSegmentAgainstRouteUsingRedirect = /**
     * @param {?} ngModule
     * @param {?} segmentGroup
     * @param {?} routes
     * @param {?} route
     * @param {?} segments
     * @param {?} outlet
     * @return {?}
     */
    function (ngModule, segmentGroup, routes, route, segments, outlet) {
        if (route.path === '**') {
            return this.expandWildCardWithParamsAgainstRouteUsingRedirect(ngModule, routes, route, outlet);
        }
        return this.expandRegularSegmentAgainstRouteUsingRedirect(ngModule, segmentGroup, routes, route, segments, outlet);
    };
    /**
     * @param {?} ngModule
     * @param {?} routes
     * @param {?} route
     * @param {?} outlet
     * @return {?}
     */
    ApplyRedirects.prototype.expandWildCardWithParamsAgainstRouteUsingRedirect = /**
     * @param {?} ngModule
     * @param {?} routes
     * @param {?} route
     * @param {?} outlet
     * @return {?}
     */
    function (ngModule, routes, route, outlet) {
        var _this = this;
        var /** @type {?} */ newTree = this.applyRedirectCommands([], /** @type {?} */ ((route.redirectTo)), {});
        if (/** @type {?} */ ((route.redirectTo)).startsWith('/')) {
            return absoluteRedirect(newTree);
        }
        return mergeMap.call(this.lineralizeSegments(route, newTree), function (newSegments) {
            var /** @type {?} */ group = new UrlSegmentGroup(newSegments, {});
            return _this.expandSegment(ngModule, group, routes, newSegments, outlet, false);
        });
    };
    /**
     * @param {?} ngModule
     * @param {?} segmentGroup
     * @param {?} routes
     * @param {?} route
     * @param {?} segments
     * @param {?} outlet
     * @return {?}
     */
    ApplyRedirects.prototype.expandRegularSegmentAgainstRouteUsingRedirect = /**
     * @param {?} ngModule
     * @param {?} segmentGroup
     * @param {?} routes
     * @param {?} route
     * @param {?} segments
     * @param {?} outlet
     * @return {?}
     */
    function (ngModule, segmentGroup, routes, route, segments, outlet) {
        var _this = this;
        var _a = match(segmentGroup, route, segments), matched = _a.matched, consumedSegments = _a.consumedSegments, lastChild = _a.lastChild, positionalParamSegments = _a.positionalParamSegments;
        if (!matched)
            return noMatch(segmentGroup);
        var /** @type {?} */ newTree = this.applyRedirectCommands(consumedSegments, /** @type {?} */ ((route.redirectTo)), /** @type {?} */ (positionalParamSegments));
        if (/** @type {?} */ ((route.redirectTo)).startsWith('/')) {
            return absoluteRedirect(newTree);
        }
        return mergeMap.call(this.lineralizeSegments(route, newTree), function (newSegments) {
            return _this.expandSegment(ngModule, segmentGroup, routes, newSegments.concat(segments.slice(lastChild)), outlet, false);
        });
    };
    /**
     * @param {?} ngModule
     * @param {?} rawSegmentGroup
     * @param {?} route
     * @param {?} segments
     * @return {?}
     */
    ApplyRedirects.prototype.matchSegmentAgainstRoute = /**
     * @param {?} ngModule
     * @param {?} rawSegmentGroup
     * @param {?} route
     * @param {?} segments
     * @return {?}
     */
    function (ngModule, rawSegmentGroup, route, segments) {
        var _this = this;
        if (route.path === '**') {
            if (route.loadChildren) {
                return map.call(this.configLoader.load(ngModule.injector, route), function (cfg) {
                    route._loadedConfig = cfg;
                    return new UrlSegmentGroup(segments, {});
                });
            }
            return of(new UrlSegmentGroup(segments, {}));
        }
        var _a = match(rawSegmentGroup, route, segments), matched = _a.matched, consumedSegments = _a.consumedSegments, lastChild = _a.lastChild;
        if (!matched)
            return noMatch(rawSegmentGroup);
        var /** @type {?} */ rawSlicedSegments = segments.slice(lastChild);
        var /** @type {?} */ childConfig$ = this.getChildConfig(ngModule, route);
        return mergeMap.call(childConfig$, function (routerConfig) {
            var /** @type {?} */ childModule = routerConfig.module;
            var /** @type {?} */ childConfig = routerConfig.routes;
            var _a = split(rawSegmentGroup, consumedSegments, rawSlicedSegments, childConfig), segmentGroup = _a.segmentGroup, slicedSegments = _a.slicedSegments;
            if (slicedSegments.length === 0 && segmentGroup.hasChildren()) {
                var /** @type {?} */ expanded$_1 = _this.expandChildren(childModule, childConfig, segmentGroup);
                return map.call(expanded$_1, function (children) { return new UrlSegmentGroup(consumedSegments, children); });
            }
            if (childConfig.length === 0 && slicedSegments.length === 0) {
                return of(new UrlSegmentGroup(consumedSegments, {}));
            }
            var /** @type {?} */ expanded$ = _this.expandSegment(childModule, segmentGroup, childConfig, slicedSegments, PRIMARY_OUTLET, true);
            return map.call(expanded$, function (cs) {
                return new UrlSegmentGroup(consumedSegments.concat(cs.segments), cs.children);
            });
        });
    };
    /**
     * @param {?} ngModule
     * @param {?} route
     * @return {?}
     */
    ApplyRedirects.prototype.getChildConfig = /**
     * @param {?} ngModule
     * @param {?} route
     * @return {?}
     */
    function (ngModule, route) {
        var _this = this;
        if (route.children) {
            // The children belong to the same module
            return of(new LoadedRouterConfig(route.children, ngModule));
        }
        if (route.loadChildren) {
            // lazy children belong to the loaded module
            if (route._loadedConfig !== undefined) {
                return of(route._loadedConfig);
            }
            return mergeMap.call(runCanLoadGuard(ngModule.injector, route), function (shouldLoad) {
                if (shouldLoad) {
                    return map.call(_this.configLoader.load(ngModule.injector, route), function (cfg) {
                        route._loadedConfig = cfg;
                        return cfg;
                    });
                }
                return canLoadFails(route);
            });
        }
        return of(new LoadedRouterConfig([], ngModule));
    };
    /**
     * @param {?} route
     * @param {?} urlTree
     * @return {?}
     */
    ApplyRedirects.prototype.lineralizeSegments = /**
     * @param {?} route
     * @param {?} urlTree
     * @return {?}
     */
    function (route, urlTree) {
        var /** @type {?} */ res = [];
        var /** @type {?} */ c = urlTree.root;
        while (true) {
            res = res.concat(c.segments);
            if (c.numberOfChildren === 0) {
                return of(res);
            }
            if (c.numberOfChildren > 1 || !c.children[PRIMARY_OUTLET]) {
                return namedOutletsRedirect(/** @type {?} */ ((route.redirectTo)));
            }
            c = c.children[PRIMARY_OUTLET];
        }
    };
    /**
     * @param {?} segments
     * @param {?} redirectTo
     * @param {?} posParams
     * @return {?}
     */
    ApplyRedirects.prototype.applyRedirectCommands = /**
     * @param {?} segments
     * @param {?} redirectTo
     * @param {?} posParams
     * @return {?}
     */
    function (segments, redirectTo, posParams) {
        return this.applyRedirectCreatreUrlTree(redirectTo, this.urlSerializer.parse(redirectTo), segments, posParams);
    };
    /**
     * @param {?} redirectTo
     * @param {?} urlTree
     * @param {?} segments
     * @param {?} posParams
     * @return {?}
     */
    ApplyRedirects.prototype.applyRedirectCreatreUrlTree = /**
     * @param {?} redirectTo
     * @param {?} urlTree
     * @param {?} segments
     * @param {?} posParams
     * @return {?}
     */
    function (redirectTo, urlTree, segments, posParams) {
        var /** @type {?} */ newRoot = this.createSegmentGroup(redirectTo, urlTree.root, segments, posParams);
        return new UrlTree(newRoot, this.createQueryParams(urlTree.queryParams, this.urlTree.queryParams), urlTree.fragment);
    };
    /**
     * @param {?} redirectToParams
     * @param {?} actualParams
     * @return {?}
     */
    ApplyRedirects.prototype.createQueryParams = /**
     * @param {?} redirectToParams
     * @param {?} actualParams
     * @return {?}
     */
    function (redirectToParams, actualParams) {
        var /** @type {?} */ res = {};
        forEach(redirectToParams, function (v, k) {
            var /** @type {?} */ copySourceValue = typeof v === 'string' && v.startsWith(':');
            if (copySourceValue) {
                var /** @type {?} */ sourceName = v.substring(1);
                res[k] = actualParams[sourceName];
            }
            else {
                res[k] = v;
            }
        });
        return res;
    };
    /**
     * @param {?} redirectTo
     * @param {?} group
     * @param {?} segments
     * @param {?} posParams
     * @return {?}
     */
    ApplyRedirects.prototype.createSegmentGroup = /**
     * @param {?} redirectTo
     * @param {?} group
     * @param {?} segments
     * @param {?} posParams
     * @return {?}
     */
    function (redirectTo, group, segments, posParams) {
        var _this = this;
        var /** @type {?} */ updatedSegments = this.createSegments(redirectTo, group.segments, segments, posParams);
        var /** @type {?} */ children = {};
        forEach(group.children, function (child, name) {
            children[name] = _this.createSegmentGroup(redirectTo, child, segments, posParams);
        });
        return new UrlSegmentGroup(updatedSegments, children);
    };
    /**
     * @param {?} redirectTo
     * @param {?} redirectToSegments
     * @param {?} actualSegments
     * @param {?} posParams
     * @return {?}
     */
    ApplyRedirects.prototype.createSegments = /**
     * @param {?} redirectTo
     * @param {?} redirectToSegments
     * @param {?} actualSegments
     * @param {?} posParams
     * @return {?}
     */
    function (redirectTo, redirectToSegments, actualSegments, posParams) {
        var _this = this;
        return redirectToSegments.map(function (s) {
            return s.path.startsWith(':') ? _this.findPosParam(redirectTo, s, posParams) :
                _this.findOrReturn(s, actualSegments);
        });
    };
    /**
     * @param {?} redirectTo
     * @param {?} redirectToUrlSegment
     * @param {?} posParams
     * @return {?}
     */
    ApplyRedirects.prototype.findPosParam = /**
     * @param {?} redirectTo
     * @param {?} redirectToUrlSegment
     * @param {?} posParams
     * @return {?}
     */
    function (redirectTo, redirectToUrlSegment, posParams) {
        var /** @type {?} */ pos = posParams[redirectToUrlSegment.path.substring(1)];
        if (!pos)
            throw new Error("Cannot redirect to '" + redirectTo + "'. Cannot find '" + redirectToUrlSegment.path + "'.");
        return pos;
    };
    /**
     * @param {?} redirectToUrlSegment
     * @param {?} actualSegments
     * @return {?}
     */
    ApplyRedirects.prototype.findOrReturn = /**
     * @param {?} redirectToUrlSegment
     * @param {?} actualSegments
     * @return {?}
     */
    function (redirectToUrlSegment, actualSegments) {
        var /** @type {?} */ idx = 0;
        for (var _i = 0, actualSegments_1 = actualSegments; _i < actualSegments_1.length; _i++) {
            var s = actualSegments_1[_i];
            if (s.path === redirectToUrlSegment.path) {
                actualSegments.splice(idx);
                return s;
            }
            idx++;
        }
        return redirectToUrlSegment;
    };
    return ApplyRedirects;
}());
/**
 * @param {?} moduleInjector
 * @param {?} route
 * @return {?}
 */
function runCanLoadGuard(moduleInjector, route) {
    var /** @type {?} */ canLoad = route.canLoad;
    if (!canLoad || canLoad.length === 0)
        return of(true);
    var /** @type {?} */ obs = map.call(from(canLoad), function (injectionToken) {
        var /** @type {?} */ guard = moduleInjector.get(injectionToken);
        return wrapIntoObservable(guard.canLoad ? guard.canLoad(route) : guard(route));
    });
    return andObservables(obs);
}
/**
 * @param {?} segmentGroup
 * @param {?} route
 * @param {?} segments
 * @return {?}
 */
function match(segmentGroup, route, segments) {
    if (route.path === '') {
        if ((route.pathMatch === 'full') && (segmentGroup.hasChildren() || segments.length > 0)) {
            return { matched: false, consumedSegments: [], lastChild: 0, positionalParamSegments: {} };
        }
        return { matched: true, consumedSegments: [], lastChild: 0, positionalParamSegments: {} };
    }
    var /** @type {?} */ matcher = route.matcher || defaultUrlMatcher;
    var /** @type {?} */ res = matcher(segments, segmentGroup, route);
    if (!res) {
        return {
            matched: false,
            consumedSegments: /** @type {?} */ ([]),
            lastChild: 0,
            positionalParamSegments: {},
        };
    }
    return {
        matched: true,
        consumedSegments: /** @type {?} */ ((res.consumed)),
        lastChild: /** @type {?} */ ((res.consumed.length)),
        positionalParamSegments: /** @type {?} */ ((res.posParams)),
    };
}
/**
 * @param {?} segmentGroup
 * @param {?} consumedSegments
 * @param {?} slicedSegments
 * @param {?} config
 * @return {?}
 */
function split(segmentGroup, consumedSegments, slicedSegments, config) {
    if (slicedSegments.length > 0 &&
        containsEmptyPathRedirectsWithNamedOutlets(segmentGroup, slicedSegments, config)) {
        var /** @type {?} */ s = new UrlSegmentGroup(consumedSegments, createChildrenForEmptySegments(config, new UrlSegmentGroup(slicedSegments, segmentGroup.children)));
        return { segmentGroup: mergeTrivialChildren(s), slicedSegments: [] };
    }
    if (slicedSegments.length === 0 &&
        containsEmptyPathRedirects(segmentGroup, slicedSegments, config)) {
        var /** @type {?} */ s = new UrlSegmentGroup(segmentGroup.segments, addEmptySegmentsToChildrenIfNeeded(segmentGroup, slicedSegments, config, segmentGroup.children));
        return { segmentGroup: mergeTrivialChildren(s), slicedSegments: slicedSegments };
    }
    return { segmentGroup: segmentGroup, slicedSegments: slicedSegments };
}
/**
 * @param {?} s
 * @return {?}
 */
function mergeTrivialChildren(s) {
    if (s.numberOfChildren === 1 && s.children[PRIMARY_OUTLET]) {
        var /** @type {?} */ c = s.children[PRIMARY_OUTLET];
        return new UrlSegmentGroup(s.segments.concat(c.segments), c.children);
    }
    return s;
}
/**
 * @param {?} segmentGroup
 * @param {?} slicedSegments
 * @param {?} routes
 * @param {?} children
 * @return {?}
 */
function addEmptySegmentsToChildrenIfNeeded(segmentGroup, slicedSegments, routes, children) {
    var /** @type {?} */ res = {};
    for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
        var r = routes_1[_i];
        if (isEmptyPathRedirect(segmentGroup, slicedSegments, r) && !children[getOutlet(r)]) {
            res[getOutlet(r)] = new UrlSegmentGroup([], {});
        }
    }
    return __assign({}, children, res);
}
/**
 * @param {?} routes
 * @param {?} primarySegmentGroup
 * @return {?}
 */
function createChildrenForEmptySegments(routes, primarySegmentGroup) {
    var /** @type {?} */ res = {};
    res[PRIMARY_OUTLET] = primarySegmentGroup;
    for (var _i = 0, routes_2 = routes; _i < routes_2.length; _i++) {
        var r = routes_2[_i];
        if (r.path === '' && getOutlet(r) !== PRIMARY_OUTLET) {
            res[getOutlet(r)] = new UrlSegmentGroup([], {});
        }
    }
    return res;
}
/**
 * @param {?} segmentGroup
 * @param {?} segments
 * @param {?} routes
 * @return {?}
 */
function containsEmptyPathRedirectsWithNamedOutlets(segmentGroup, segments, routes) {
    return routes.some(function (r) { return isEmptyPathRedirect(segmentGroup, segments, r) && getOutlet(r) !== PRIMARY_OUTLET; });
}
/**
 * @param {?} segmentGroup
 * @param {?} segments
 * @param {?} routes
 * @return {?}
 */
function containsEmptyPathRedirects(segmentGroup, segments, routes) {
    return routes.some(function (r) { return isEmptyPathRedirect(segmentGroup, segments, r); });
}
/**
 * @param {?} segmentGroup
 * @param {?} segments
 * @param {?} r
 * @return {?}
 */
function isEmptyPathRedirect(segmentGroup, segments, r) {
    if ((segmentGroup.hasChildren() || segments.length > 0) && r.pathMatch === 'full') {
        return false;
    }
    return r.path === '' && r.redirectTo !== undefined;
}
/**
 * @param {?} route
 * @return {?}
 */
function getOutlet(route) {
    return route.outlet || PRIMARY_OUTLET;
}

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
var Tree = /** @class */ (function () {
    function Tree(root) {
        this._root = root;
    }
    Object.defineProperty(Tree.prototype, "root", {
        get: /**
         * @return {?}
         */
        function () { return this._root.value; },
        enumerable: true,
        configurable: true
    });
    /**
     * @internal
     */
    /**
     * \@internal
     * @param {?} t
     * @return {?}
     */
    Tree.prototype.parent = /**
     * \@internal
     * @param {?} t
     * @return {?}
     */
    function (t) {
        var /** @type {?} */ p = this.pathFromRoot(t);
        return p.length > 1 ? p[p.length - 2] : null;
    };
    /**
     * @internal
     */
    /**
     * \@internal
     * @param {?} t
     * @return {?}
     */
    Tree.prototype.children = /**
     * \@internal
     * @param {?} t
     * @return {?}
     */
    function (t) {
        var /** @type {?} */ n = findNode(t, this._root);
        return n ? n.children.map(function (t) { return t.value; }) : [];
    };
    /**
     * @internal
     */
    /**
     * \@internal
     * @param {?} t
     * @return {?}
     */
    Tree.prototype.firstChild = /**
     * \@internal
     * @param {?} t
     * @return {?}
     */
    function (t) {
        var /** @type {?} */ n = findNode(t, this._root);
        return n && n.children.length > 0 ? n.children[0].value : null;
    };
    /**
     * @internal
     */
    /**
     * \@internal
     * @param {?} t
     * @return {?}
     */
    Tree.prototype.siblings = /**
     * \@internal
     * @param {?} t
     * @return {?}
     */
    function (t) {
        var /** @type {?} */ p = findPath(t, this._root);
        if (p.length < 2)
            return [];
        var /** @type {?} */ c = p[p.length - 2].children.map(function (c) { return c.value; });
        return c.filter(function (cc) { return cc !== t; });
    };
    /**
     * @internal
     */
    /**
     * \@internal
     * @param {?} t
     * @return {?}
     */
    Tree.prototype.pathFromRoot = /**
     * \@internal
     * @param {?} t
     * @return {?}
     */
    function (t) { return findPath(t, this._root).map(function (s) { return s.value; }); };
    return Tree;
}());
/**
 * @template T
 * @param {?} value
 * @param {?} node
 * @return {?}
 */
function findNode(value, node) {
    if (value === node.value)
        return node;
    for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
        var child = _a[_i];
        var /** @type {?} */ node_1 = findNode(value, child);
        if (node_1)
            return node_1;
    }
    return null;
}
/**
 * @template T
 * @param {?} value
 * @param {?} node
 * @return {?}
 */
function findPath(value, node) {
    if (value === node.value)
        return [node];
    for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
        var child = _a[_i];
        var /** @type {?} */ path = findPath(value, child);
        if (path.length) {
            path.unshift(node);
            return path;
        }
    }
    return [];
}
var TreeNode = /** @class */ (function () {
    function TreeNode(value, children) {
        this.value = value;
        this.children = children;
    }
    /**
     * @return {?}
     */
    TreeNode.prototype.toString = /**
     * @return {?}
     */
    function () { return "TreeNode(" + this.value + ")"; };
    return TreeNode;
}());
/**
 * @template T
 * @param {?} node
 * @return {?}
 */
function nodeChildrenAsMap(node) {
    var /** @type {?} */ map$$1 = {};
    if (node) {
        node.children.forEach(function (child) { return map$$1[child.value.outlet] = child; });
    }
    return map$$1;
}

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
 * \@whatItDoes Represents the state of the router.
 *
 * \@howToUse
 *
 * ```
 * \@Component({templateUrl:'template.html'})
 * class MyComponent {
 *   constructor(router: Router) {
 *     const state: RouterState = router.routerState;
 *     const root: ActivatedRoute = state.root;
 *     const child = root.firstChild;
 *     const id: Observable<string> = child.params.map(p => p.id);
 *     //...
 *   }
 * }
 * ```
 *
 * \@description
 * RouterState is a tree of activated routes. Every node in this tree knows about the "consumed" URL
 * segments, the extracted parameters, and the resolved data.
 *
 * See {\@link ActivatedRoute} for more information.
 *
 * \@stable
 */
var RouterState = /** @class */ (function (_super) {
    __extends(RouterState, _super);
    /** @internal */
    function RouterState(root, snapshot) {
        var _this = _super.call(this, root) || this;
        _this.snapshot = snapshot;
        setRouterState(/** @type {?} */ (_this), root);
        return _this;
    }
    /**
     * @return {?}
     */
    RouterState.prototype.toString = /**
     * @return {?}
     */
    function () { return this.snapshot.toString(); };
    return RouterState;
}(Tree));
/**
 * @param {?} urlTree
 * @param {?} rootComponent
 * @return {?}
 */
function createEmptyState(urlTree, rootComponent) {
    var /** @type {?} */ snapshot = createEmptyStateSnapshot(urlTree, rootComponent);
    var /** @type {?} */ emptyUrl = new BehaviorSubject([new UrlSegment('', {})]);
    var /** @type {?} */ emptyParams = new BehaviorSubject({});
    var /** @type {?} */ emptyData = new BehaviorSubject({});
    var /** @type {?} */ emptyQueryParams = new BehaviorSubject({});
    var /** @type {?} */ fragment = new BehaviorSubject('');
    var /** @type {?} */ activated = new ActivatedRoute(emptyUrl, emptyParams, emptyQueryParams, fragment, emptyData, PRIMARY_OUTLET, rootComponent, snapshot.root);
    activated.snapshot = snapshot.root;
    return new RouterState(new TreeNode(activated, []), snapshot);
}
/**
 * @param {?} urlTree
 * @param {?} rootComponent
 * @return {?}
 */
function createEmptyStateSnapshot(urlTree, rootComponent) {
    var /** @type {?} */ emptyParams = {};
    var /** @type {?} */ emptyData = {};
    var /** @type {?} */ emptyQueryParams = {};
    var /** @type {?} */ fragment = '';
    var /** @type {?} */ activated = new ActivatedRouteSnapshot([], emptyParams, emptyQueryParams, fragment, emptyData, PRIMARY_OUTLET, rootComponent, null, urlTree.root, -1, {});
    return new RouterStateSnapshot('', new TreeNode(activated, []));
}
/**
 * \@whatItDoes Contains the information about a route associated with a component loaded in an
 * outlet.
 * An `ActivatedRoute` can also be used to traverse the router state tree.
 *
 * \@howToUse
 *
 * ```
 * \@Component({...})
 * class MyComponent {
 *   constructor(route: ActivatedRoute) {
 *     const id: Observable<string> = route.params.map(p => p.id);
 *     const url: Observable<string> = route.url.map(segments => segments.join(''));
 *     // route.data includes both `data` and `resolve`
 *     const user = route.data.map(d => d.user);
 *   }
 * }
 * ```
 *
 * \@stable
 */
var ActivatedRoute = /** @class */ (function () {
    /** @internal */
    function ActivatedRoute(url, params, queryParams, fragment, data, outlet, component, futureSnapshot) {
        this.url = url;
        this.params = params;
        this.queryParams = queryParams;
        this.fragment = fragment;
        this.data = data;
        this.outlet = outlet;
        this.component = component;
        this._futureSnapshot = futureSnapshot;
    }
    Object.defineProperty(ActivatedRoute.prototype, "routeConfig", {
        /** The configuration used to match this route */
        get: /**
         * The configuration used to match this route
         * @return {?}
         */
        function () { return this._futureSnapshot.routeConfig; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "root", {
        /** The root of the router state */
        get: /**
         * The root of the router state
         * @return {?}
         */
        function () { return this._routerState.root; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "parent", {
        /** The parent of this route in the router state tree */
        get: /**
         * The parent of this route in the router state tree
         * @return {?}
         */
        function () { return this._routerState.parent(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "firstChild", {
        /** The first child of this route in the router state tree */
        get: /**
         * The first child of this route in the router state tree
         * @return {?}
         */
        function () { return this._routerState.firstChild(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "children", {
        /** The children of this route in the router state tree */
        get: /**
         * The children of this route in the router state tree
         * @return {?}
         */
        function () { return this._routerState.children(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "pathFromRoot", {
        /** The path from the root of the router state tree to this route */
        get: /**
         * The path from the root of the router state tree to this route
         * @return {?}
         */
        function () { return this._routerState.pathFromRoot(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "paramMap", {
        get: /**
         * @return {?}
         */
        function () {
            if (!this._paramMap) {
                this._paramMap = map.call(this.params, function (p) { return convertToParamMap(p); });
            }
            return this._paramMap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRoute.prototype, "queryParamMap", {
        get: /**
         * @return {?}
         */
        function () {
            if (!this._queryParamMap) {
                this._queryParamMap =
                    map.call(this.queryParams, function (p) { return convertToParamMap(p); });
            }
            return this._queryParamMap;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    ActivatedRoute.prototype.toString = /**
     * @return {?}
     */
    function () {
        return this.snapshot ? this.snapshot.toString() : "Future(" + this._futureSnapshot + ")";
    };
    return ActivatedRoute;
}());
/**
 * Returns the inherited params, data, and resolve for a given route.
 * By default, this only inherits values up to the nearest path-less or component-less route.
 * \@internal
 * @param {?} route
 * @param {?=} paramsInheritanceStrategy
 * @return {?}
 */
function inheritedParamsDataResolve(route, paramsInheritanceStrategy) {
    if (paramsInheritanceStrategy === void 0) { paramsInheritanceStrategy = 'emptyOnly'; }
    var /** @type {?} */ pathFromRoot = route.pathFromRoot;
    var /** @type {?} */ inheritingStartingFrom = 0;
    if (paramsInheritanceStrategy !== 'always') {
        inheritingStartingFrom = pathFromRoot.length - 1;
        while (inheritingStartingFrom >= 1) {
            var /** @type {?} */ current = pathFromRoot[inheritingStartingFrom];
            var /** @type {?} */ parent_1 = pathFromRoot[inheritingStartingFrom - 1];
            // current route is an empty path => inherits its parent's params and data
            if (current.routeConfig && current.routeConfig.path === '') {
                inheritingStartingFrom--;
                // parent is componentless => current route should inherit its params and data
            }
            else if (!parent_1.component) {
                inheritingStartingFrom--;
            }
            else {
                break;
            }
        }
    }
    return flattenInherited(pathFromRoot.slice(inheritingStartingFrom));
}
/**
 * \@internal
 * @param {?} pathFromRoot
 * @return {?}
 */
function flattenInherited(pathFromRoot) {
    return pathFromRoot.reduce(function (res, curr) {
        var /** @type {?} */ params = __assign({}, res.params, curr.params);
        var /** @type {?} */ data = __assign({}, res.data, curr.data);
        var /** @type {?} */ resolve = __assign({}, res.resolve, curr._resolvedData);
        return { params: params, data: data, resolve: resolve };
    }, /** @type {?} */ ({ params: {}, data: {}, resolve: {} }));
}
/**
 * \@whatItDoes Contains the information about a route associated with a component loaded in an
 * outlet
 * at a particular moment in time. ActivatedRouteSnapshot can also be used to traverse the router
 * state tree.
 *
 * \@howToUse
 *
 * ```
 * \@Component({templateUrl:'./my-component.html'})
 * class MyComponent {
 *   constructor(route: ActivatedRoute) {
 *     const id: string = route.snapshot.params.id;
 *     const url: string = route.snapshot.url.join('');
 *     const user = route.snapshot.data.user;
 *   }
 * }
 * ```
 *
 * \@stable
 */
var ActivatedRouteSnapshot = /** @class */ (function () {
    /** @internal */
    function ActivatedRouteSnapshot(url, params, queryParams, fragment, data, outlet, component, routeConfig, urlSegment, lastPathIndex, resolve) {
        this.url = url;
        this.params = params;
        this.queryParams = queryParams;
        this.fragment = fragment;
        this.data = data;
        this.outlet = outlet;
        this.component = component;
        this.routeConfig = routeConfig;
        this._urlSegment = urlSegment;
        this._lastPathIndex = lastPathIndex;
        this._resolve = resolve;
    }
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "root", {
        /** The root of the router state */
        get: /**
         * The root of the router state
         * @return {?}
         */
        function () { return this._routerState.root; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "parent", {
        /** The parent of this route in the router state tree */
        get: /**
         * The parent of this route in the router state tree
         * @return {?}
         */
        function () { return this._routerState.parent(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "firstChild", {
        /** The first child of this route in the router state tree */
        get: /**
         * The first child of this route in the router state tree
         * @return {?}
         */
        function () { return this._routerState.firstChild(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "children", {
        /** The children of this route in the router state tree */
        get: /**
         * The children of this route in the router state tree
         * @return {?}
         */
        function () { return this._routerState.children(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "pathFromRoot", {
        /** The path from the root of the router state tree to this route */
        get: /**
         * The path from the root of the router state tree to this route
         * @return {?}
         */
        function () { return this._routerState.pathFromRoot(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "paramMap", {
        get: /**
         * @return {?}
         */
        function () {
            if (!this._paramMap) {
                this._paramMap = convertToParamMap(this.params);
            }
            return this._paramMap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteSnapshot.prototype, "queryParamMap", {
        get: /**
         * @return {?}
         */
        function () {
            if (!this._queryParamMap) {
                this._queryParamMap = convertToParamMap(this.queryParams);
            }
            return this._queryParamMap;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    ActivatedRouteSnapshot.prototype.toString = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ url = this.url.map(function (segment) { return segment.toString(); }).join('/');
        var /** @type {?} */ matched = this.routeConfig ? this.routeConfig.path : '';
        return "Route(url:'" + url + "', path:'" + matched + "')";
    };
    return ActivatedRouteSnapshot;
}());
/**
 * \@whatItDoes Represents the state of the router at a moment in time.
 *
 * \@howToUse
 *
 * ```
 * \@Component({templateUrl:'template.html'})
 * class MyComponent {
 *   constructor(router: Router) {
 *     const state: RouterState = router.routerState;
 *     const snapshot: RouterStateSnapshot = state.snapshot;
 *     const root: ActivatedRouteSnapshot = snapshot.root;
 *     const child = root.firstChild;
 *     const id: Observable<string> = child.params.map(p => p.id);
 *     //...
 *   }
 * }
 * ```
 *
 * \@description
 * RouterStateSnapshot is a tree of activated route snapshots. Every node in this tree knows about
 * the "consumed" URL segments, the extracted parameters, and the resolved data.
 *
 * \@stable
 */
var RouterStateSnapshot = /** @class */ (function (_super) {
    __extends(RouterStateSnapshot, _super);
    /** @internal */
    function RouterStateSnapshot(url, root) {
        var _this = _super.call(this, root) || this;
        _this.url = url;
        setRouterState(/** @type {?} */ (_this), root);
        return _this;
    }
    /**
     * @return {?}
     */
    RouterStateSnapshot.prototype.toString = /**
     * @return {?}
     */
    function () { return serializeNode(this._root); };
    return RouterStateSnapshot;
}(Tree));
/**
 * @template U, T
 * @param {?} state
 * @param {?} node
 * @return {?}
 */
function setRouterState(state, node) {
    node.value._routerState = state;
    node.children.forEach(function (c) { return setRouterState(state, c); });
}
/**
 * @param {?} node
 * @return {?}
 */
function serializeNode(node) {
    var /** @type {?} */ c = node.children.length > 0 ? " { " + node.children.map(serializeNode).join(', ') + " } " : '';
    return "" + node.value + c;
}
/**
 * The expectation is that the activate route is created with the right set of parameters.
 * So we push new values into the observables only when they are not the initial values.
 * And we detect that by checking if the snapshot field is set.
 * @param {?} route
 * @return {?}
 */
function advanceActivatedRoute(route) {
    if (route.snapshot) {
        var /** @type {?} */ currentSnapshot = route.snapshot;
        var /** @type {?} */ nextSnapshot = route._futureSnapshot;
        route.snapshot = nextSnapshot;
        if (!shallowEqual(currentSnapshot.queryParams, nextSnapshot.queryParams)) {
            (/** @type {?} */ (route.queryParams)).next(nextSnapshot.queryParams);
        }
        if (currentSnapshot.fragment !== nextSnapshot.fragment) {
            (/** @type {?} */ (route.fragment)).next(nextSnapshot.fragment);
        }
        if (!shallowEqual(currentSnapshot.params, nextSnapshot.params)) {
            (/** @type {?} */ (route.params)).next(nextSnapshot.params);
        }
        if (!shallowEqualArrays(currentSnapshot.url, nextSnapshot.url)) {
            (/** @type {?} */ (route.url)).next(nextSnapshot.url);
        }
        if (!shallowEqual(currentSnapshot.data, nextSnapshot.data)) {
            (/** @type {?} */ (route.data)).next(nextSnapshot.data);
        }
    }
    else {
        route.snapshot = route._futureSnapshot;
        // this is for resolved data
        (/** @type {?} */ (route.data)).next(route._futureSnapshot.data);
    }
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function equalParamsAndUrlSegments(a, b) {
    var /** @type {?} */ equalUrlParams = shallowEqual(a.params, b.params) && equalSegments(a.url, b.url);
    var /** @type {?} */ parentsMismatch = !a.parent !== !b.parent;
    return equalUrlParams && !parentsMismatch &&
        (!a.parent || equalParamsAndUrlSegments(a.parent, /** @type {?} */ ((b.parent))));
}

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
 * @param {?} routeReuseStrategy
 * @param {?} curr
 * @param {?} prevState
 * @return {?}
 */
function createRouterState(routeReuseStrategy, curr, prevState) {
    var /** @type {?} */ root = createNode(routeReuseStrategy, curr._root, prevState ? prevState._root : undefined);
    return new RouterState(root, curr);
}
/**
 * @param {?} routeReuseStrategy
 * @param {?} curr
 * @param {?=} prevState
 * @return {?}
 */
function createNode(routeReuseStrategy, curr, prevState) {
    // reuse an activated route that is currently displayed on the screen
    if (prevState && routeReuseStrategy.shouldReuseRoute(curr.value, prevState.value.snapshot)) {
        var /** @type {?} */ value = prevState.value;
        value._futureSnapshot = curr.value;
        var /** @type {?} */ children = createOrReuseChildren(routeReuseStrategy, curr, prevState);
        return new TreeNode(value, children);
        // retrieve an activated route that is used to be displayed, but is not currently displayed
    }
    else if (routeReuseStrategy.retrieve(curr.value)) {
        var /** @type {?} */ tree = (/** @type {?} */ (routeReuseStrategy.retrieve(curr.value))).route;
        setFutureSnapshotsOfActivatedRoutes(curr, tree);
        return tree;
    }
    else {
        var /** @type {?} */ value = createActivatedRoute(curr.value);
        var /** @type {?} */ children = curr.children.map(function (c) { return createNode(routeReuseStrategy, c); });
        return new TreeNode(value, children);
    }
}
/**
 * @param {?} curr
 * @param {?} result
 * @return {?}
 */
function setFutureSnapshotsOfActivatedRoutes(curr, result) {
    if (curr.value.routeConfig !== result.value.routeConfig) {
        throw new Error('Cannot reattach ActivatedRouteSnapshot created from a different route');
    }
    if (curr.children.length !== result.children.length) {
        throw new Error('Cannot reattach ActivatedRouteSnapshot with a different number of children');
    }
    result.value._futureSnapshot = curr.value;
    for (var /** @type {?} */ i = 0; i < curr.children.length; ++i) {
        setFutureSnapshotsOfActivatedRoutes(curr.children[i], result.children[i]);
    }
}
/**
 * @param {?} routeReuseStrategy
 * @param {?} curr
 * @param {?} prevState
 * @return {?}
 */
function createOrReuseChildren(routeReuseStrategy, curr, prevState) {
    return curr.children.map(function (child) {
        for (var _i = 0, _a = prevState.children; _i < _a.length; _i++) {
            var p = _a[_i];
            if (routeReuseStrategy.shouldReuseRoute(p.value.snapshot, child.value)) {
                return createNode(routeReuseStrategy, child, p);
            }
        }
        return createNode(routeReuseStrategy, child);
    });
}
/**
 * @param {?} c
 * @return {?}
 */
function createActivatedRoute(c) {
    return new ActivatedRoute(new BehaviorSubject(c.url), new BehaviorSubject(c.params), new BehaviorSubject(c.queryParams), new BehaviorSubject(c.fragment), new BehaviorSubject(c.data), c.outlet, c.component, c);
}

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
 * @param {?} route
 * @param {?} urlTree
 * @param {?} commands
 * @param {?} queryParams
 * @param {?} fragment
 * @return {?}
 */
function createUrlTree(route, urlTree, commands, queryParams, fragment) {
    if (commands.length === 0) {
        return tree(urlTree.root, urlTree.root, urlTree, queryParams, fragment);
    }
    var /** @type {?} */ nav = computeNavigation(commands);
    if (nav.toRoot()) {
        return tree(urlTree.root, new UrlSegmentGroup([], {}), urlTree, queryParams, fragment);
    }
    var /** @type {?} */ startingPosition = findStartingPosition(nav, urlTree, route);
    var /** @type {?} */ segmentGroup = startingPosition.processChildren ?
        updateSegmentGroupChildren(startingPosition.segmentGroup, startingPosition.index, nav.commands) :
        updateSegmentGroup(startingPosition.segmentGroup, startingPosition.index, nav.commands);
    return tree(startingPosition.segmentGroup, segmentGroup, urlTree, queryParams, fragment);
}
/**
 * @param {?} command
 * @return {?}
 */
function isMatrixParams(command) {
    return typeof command === 'object' && command != null && !command.outlets && !command.segmentPath;
}
/**
 * @param {?} oldSegmentGroup
 * @param {?} newSegmentGroup
 * @param {?} urlTree
 * @param {?} queryParams
 * @param {?} fragment
 * @return {?}
 */
function tree(oldSegmentGroup, newSegmentGroup, urlTree, queryParams, fragment) {
    var /** @type {?} */ qp = {};
    if (queryParams) {
        forEach(queryParams, function (value, name) {
            qp[name] = Array.isArray(value) ? value.map(function (v) { return "" + v; }) : "" + value;
        });
    }
    if (urlTree.root === oldSegmentGroup) {
        return new UrlTree(newSegmentGroup, qp, fragment);
    }
    return new UrlTree(replaceSegment(urlTree.root, oldSegmentGroup, newSegmentGroup), qp, fragment);
}
/**
 * @param {?} current
 * @param {?} oldSegment
 * @param {?} newSegment
 * @return {?}
 */
function replaceSegment(current, oldSegment, newSegment) {
    var /** @type {?} */ children = {};
    forEach(current.children, function (c, outletName) {
        if (c === oldSegment) {
            children[outletName] = newSegment;
        }
        else {
            children[outletName] = replaceSegment(c, oldSegment, newSegment);
        }
    });
    return new UrlSegmentGroup(current.segments, children);
}
var Navigation = /** @class */ (function () {
    function Navigation(isAbsolute, numberOfDoubleDots, commands) {
        this.isAbsolute = isAbsolute;
        this.numberOfDoubleDots = numberOfDoubleDots;
        this.commands = commands;
        if (isAbsolute && commands.length > 0 && isMatrixParams(commands[0])) {
            throw new Error('Root segment cannot have matrix parameters');
        }
        var /** @type {?} */ cmdWithOutlet = commands.find(function (c) { return typeof c === 'object' && c != null && c.outlets; });
        if (cmdWithOutlet && cmdWithOutlet !== last$1(commands)) {
            throw new Error('{outlets:{}} has to be the last command');
        }
    }
    /**
     * @return {?}
     */
    Navigation.prototype.toRoot = /**
     * @return {?}
     */
    function () {
        return this.isAbsolute && this.commands.length === 1 && this.commands[0] == '/';
    };
    return Navigation;
}());
/**
 * Transforms commands to a normalized `Navigation`
 * @param {?} commands
 * @return {?}
 */
function computeNavigation(commands) {
    if ((typeof commands[0] === 'string') && commands.length === 1 && commands[0] === '/') {
        return new Navigation(true, 0, commands);
    }
    var /** @type {?} */ numberOfDoubleDots = 0;
    var /** @type {?} */ isAbsolute = false;
    var /** @type {?} */ res = commands.reduce(function (res, cmd, cmdIdx) {
        if (typeof cmd === 'object' && cmd != null) {
            if (cmd.outlets) {
                var /** @type {?} */ outlets_1 = {};
                forEach(cmd.outlets, function (commands, name) {
                    outlets_1[name] = typeof commands === 'string' ? commands.split('/') : commands;
                });
                return res.concat([{ outlets: outlets_1 }]);
            }
            if (cmd.segmentPath) {
                return res.concat([cmd.segmentPath]);
            }
        }
        if (!(typeof cmd === 'string')) {
            return res.concat([cmd]);
        }
        if (cmdIdx === 0) {
            cmd.split('/').forEach(function (urlPart, partIndex) {
                if (partIndex == 0 && urlPart === '.') {
                    // skip './a'
                }
                else if (partIndex == 0 && urlPart === '') {
                    //  '/a'
                    isAbsolute = true;
                }
                else if (urlPart === '..') {
                    //  '../a'
                    numberOfDoubleDots++;
                }
                else if (urlPart != '') {
                    res.push(urlPart);
                }
            });
            return res;
        }
        return res.concat([cmd]);
    }, []);
    return new Navigation(isAbsolute, numberOfDoubleDots, res);
}
var Position = /** @class */ (function () {
    function Position(segmentGroup, processChildren, index) {
        this.segmentGroup = segmentGroup;
        this.processChildren = processChildren;
        this.index = index;
    }
    return Position;
}());
/**
 * @param {?} nav
 * @param {?} tree
 * @param {?} route
 * @return {?}
 */
function findStartingPosition(nav, tree, route) {
    if (nav.isAbsolute) {
        return new Position(tree.root, true, 0);
    }
    if (route.snapshot._lastPathIndex === -1) {
        return new Position(route.snapshot._urlSegment, true, 0);
    }
    var /** @type {?} */ modifier = isMatrixParams(nav.commands[0]) ? 0 : 1;
    var /** @type {?} */ index = route.snapshot._lastPathIndex + modifier;
    return createPositionApplyingDoubleDots(route.snapshot._urlSegment, index, nav.numberOfDoubleDots);
}
/**
 * @param {?} group
 * @param {?} index
 * @param {?} numberOfDoubleDots
 * @return {?}
 */
function createPositionApplyingDoubleDots(group, index, numberOfDoubleDots) {
    var /** @type {?} */ g = group;
    var /** @type {?} */ ci = index;
    var /** @type {?} */ dd = numberOfDoubleDots;
    while (dd > ci) {
        dd -= ci;
        g = /** @type {?} */ ((g.parent));
        if (!g) {
            throw new Error('Invalid number of \'../\'');
        }
        ci = g.segments.length;
    }
    return new Position(g, false, ci - dd);
}
/**
 * @param {?} command
 * @return {?}
 */
function getPath(command) {
    if (typeof command === 'object' && command != null && command.outlets) {
        return command.outlets[PRIMARY_OUTLET];
    }
    return "" + command;
}
/**
 * @param {?} commands
 * @return {?}
 */
function getOutlets(commands) {
    if (!(typeof commands[0] === 'object'))
        return _a = {}, _a[PRIMARY_OUTLET] = commands, _a;
    if (commands[0].outlets === undefined)
        return _b = {}, _b[PRIMARY_OUTLET] = commands, _b;
    return commands[0].outlets;
    var _a, _b;
}
/**
 * @param {?} segmentGroup
 * @param {?} startIndex
 * @param {?} commands
 * @return {?}
 */
function updateSegmentGroup(segmentGroup, startIndex, commands) {
    if (!segmentGroup) {
        segmentGroup = new UrlSegmentGroup([], {});
    }
    if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
        return updateSegmentGroupChildren(segmentGroup, startIndex, commands);
    }
    var /** @type {?} */ m = prefixedWith(segmentGroup, startIndex, commands);
    var /** @type {?} */ slicedCommands = commands.slice(m.commandIndex);
    if (m.match && m.pathIndex < segmentGroup.segments.length) {
        var /** @type {?} */ g = new UrlSegmentGroup(segmentGroup.segments.slice(0, m.pathIndex), {});
        g.children[PRIMARY_OUTLET] =
            new UrlSegmentGroup(segmentGroup.segments.slice(m.pathIndex), segmentGroup.children);
        return updateSegmentGroupChildren(g, 0, slicedCommands);
    }
    else if (m.match && slicedCommands.length === 0) {
        return new UrlSegmentGroup(segmentGroup.segments, {});
    }
    else if (m.match && !segmentGroup.hasChildren()) {
        return createNewSegmentGroup(segmentGroup, startIndex, commands);
    }
    else if (m.match) {
        return updateSegmentGroupChildren(segmentGroup, 0, slicedCommands);
    }
    else {
        return createNewSegmentGroup(segmentGroup, startIndex, commands);
    }
}
/**
 * @param {?} segmentGroup
 * @param {?} startIndex
 * @param {?} commands
 * @return {?}
 */
function updateSegmentGroupChildren(segmentGroup, startIndex, commands) {
    if (commands.length === 0) {
        return new UrlSegmentGroup(segmentGroup.segments, {});
    }
    else {
        var /** @type {?} */ outlets_2 = getOutlets(commands);
        var /** @type {?} */ children_1 = {};
        forEach(outlets_2, function (commands, outlet) {
            if (commands !== null) {
                children_1[outlet] = updateSegmentGroup(segmentGroup.children[outlet], startIndex, commands);
            }
        });
        forEach(segmentGroup.children, function (child, childOutlet) {
            if (outlets_2[childOutlet] === undefined) {
                children_1[childOutlet] = child;
            }
        });
        return new UrlSegmentGroup(segmentGroup.segments, children_1);
    }
}
/**
 * @param {?} segmentGroup
 * @param {?} startIndex
 * @param {?} commands
 * @return {?}
 */
function prefixedWith(segmentGroup, startIndex, commands) {
    var /** @type {?} */ currentCommandIndex = 0;
    var /** @type {?} */ currentPathIndex = startIndex;
    var /** @type {?} */ noMatch = { match: false, pathIndex: 0, commandIndex: 0 };
    while (currentPathIndex < segmentGroup.segments.length) {
        if (currentCommandIndex >= commands.length)
            return noMatch;
        var /** @type {?} */ path = segmentGroup.segments[currentPathIndex];
        var /** @type {?} */ curr = getPath(commands[currentCommandIndex]);
        var /** @type {?} */ next = currentCommandIndex < commands.length - 1 ? commands[currentCommandIndex + 1] : null;
        if (currentPathIndex > 0 && curr === undefined)
            break;
        if (curr && next && (typeof next === 'object') && next.outlets === undefined) {
            if (!compare(curr, next, path))
                return noMatch;
            currentCommandIndex += 2;
        }
        else {
            if (!compare(curr, {}, path))
                return noMatch;
            currentCommandIndex++;
        }
        currentPathIndex++;
    }
    return { match: true, pathIndex: currentPathIndex, commandIndex: currentCommandIndex };
}
/**
 * @param {?} segmentGroup
 * @param {?} startIndex
 * @param {?} commands
 * @return {?}
 */
function createNewSegmentGroup(segmentGroup, startIndex, commands) {
    var /** @type {?} */ paths = segmentGroup.segments.slice(0, startIndex);
    var /** @type {?} */ i = 0;
    while (i < commands.length) {
        if (typeof commands[i] === 'object' && commands[i].outlets !== undefined) {
            var /** @type {?} */ children = createNewSegmentChildren(commands[i].outlets);
            return new UrlSegmentGroup(paths, children);
        }
        // if we start with an object literal, we need to reuse the path part from the segment
        if (i === 0 && isMatrixParams(commands[0])) {
            var /** @type {?} */ p = segmentGroup.segments[startIndex];
            paths.push(new UrlSegment(p.path, commands[0]));
            i++;
            continue;
        }
        var /** @type {?} */ curr = getPath(commands[i]);
        var /** @type {?} */ next = (i < commands.length - 1) ? commands[i + 1] : null;
        if (curr && next && isMatrixParams(next)) {
            paths.push(new UrlSegment(curr, stringify(next)));
            i += 2;
        }
        else {
            paths.push(new UrlSegment(curr, {}));
            i++;
        }
    }
    return new UrlSegmentGroup(paths, {});
}
/**
 * @param {?} outlets
 * @return {?}
 */
function createNewSegmentChildren(outlets) {
    var /** @type {?} */ children = {};
    forEach(outlets, function (commands, outlet) {
        if (commands !== null) {
            children[outlet] = createNewSegmentGroup(new UrlSegmentGroup([], {}), 0, commands);
        }
    });
    return children;
}
/**
 * @param {?} params
 * @return {?}
 */
function stringify(params) {
    var /** @type {?} */ res = {};
    forEach(params, function (v, k) { return res[k] = "" + v; });
    return res;
}
/**
 * @param {?} path
 * @param {?} params
 * @param {?} segment
 * @return {?}
 */
function compare(path, params, segment) {
    return path == segment.path && shallowEqual(params, segment.parameters);
}

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
var CanActivate = /** @class */ (function () {
    function CanActivate(path) {
        this.path = path;
        this.route = this.path[this.path.length - 1];
    }
    return CanActivate;
}());
var CanDeactivate = /** @class */ (function () {
    function CanDeactivate(component, route) {
        this.component = component;
        this.route = route;
    }
    return CanDeactivate;
}());
/**
 * This class bundles the actions involved in preactivation of a route.
 */
var PreActivation = /** @class */ (function () {
    function PreActivation(future, curr, moduleInjector, forwardEvent) {
        this.future = future;
        this.curr = curr;
        this.moduleInjector = moduleInjector;
        this.forwardEvent = forwardEvent;
        this.canActivateChecks = [];
        this.canDeactivateChecks = [];
    }
    /**
     * @param {?} parentContexts
     * @return {?}
     */
    PreActivation.prototype.initialize = /**
     * @param {?} parentContexts
     * @return {?}
     */
    function (parentContexts) {
        var /** @type {?} */ futureRoot = this.future._root;
        var /** @type {?} */ currRoot = this.curr ? this.curr._root : null;
        this.setupChildRouteGuards(futureRoot, currRoot, parentContexts, [futureRoot.value]);
    };
    /**
     * @return {?}
     */
    PreActivation.prototype.checkGuards = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.isDeactivating() && !this.isActivating()) {
            return of(true);
        }
        var /** @type {?} */ canDeactivate$ = this.runCanDeactivateChecks();
        return mergeMap.call(canDeactivate$, function (canDeactivate) { return canDeactivate ? _this.runCanActivateChecks() : of(false); });
    };
    /**
     * @param {?} paramsInheritanceStrategy
     * @return {?}
     */
    PreActivation.prototype.resolveData = /**
     * @param {?} paramsInheritanceStrategy
     * @return {?}
     */
    function (paramsInheritanceStrategy) {
        var _this = this;
        if (!this.isActivating())
            return of(null);
        var /** @type {?} */ checks$ = from(this.canActivateChecks);
        var /** @type {?} */ runningChecks$ = concatMap.call(checks$, function (check) { return _this.runResolve(check.route, paramsInheritanceStrategy); });
        return reduce.call(runningChecks$, function (_, __) { return _; });
    };
    /**
     * @return {?}
     */
    PreActivation.prototype.isDeactivating = /**
     * @return {?}
     */
    function () { return this.canDeactivateChecks.length !== 0; };
    /**
     * @return {?}
     */
    PreActivation.prototype.isActivating = /**
     * @return {?}
     */
    function () { return this.canActivateChecks.length !== 0; };
    /**
     * Iterates over child routes and calls recursive `setupRouteGuards` to get `this` instance in
     * proper state to run `checkGuards()` method.
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} contexts
     * @param {?} futurePath
     * @return {?}
     */
    PreActivation.prototype.setupChildRouteGuards = /**
     * Iterates over child routes and calls recursive `setupRouteGuards` to get `this` instance in
     * proper state to run `checkGuards()` method.
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} contexts
     * @param {?} futurePath
     * @return {?}
     */
    function (futureNode, currNode, contexts, futurePath) {
        var _this = this;
        var /** @type {?} */ prevChildren = nodeChildrenAsMap(currNode);
        // Process the children of the future route
        futureNode.children.forEach(function (c) {
            _this.setupRouteGuards(c, prevChildren[c.value.outlet], contexts, futurePath.concat([c.value]));
            delete prevChildren[c.value.outlet];
        });
        // Process any children left from the current route (not active for the future route)
        forEach(prevChildren, function (v, k) {
            return _this.deactivateRouteAndItsChildren(v, /** @type {?} */ ((contexts)).getContext(k));
        });
    };
    /**
     * Iterates over child routes and calls recursive `setupRouteGuards` to get `this` instance in
     * proper state to run `checkGuards()` method.
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} parentContexts
     * @param {?} futurePath
     * @return {?}
     */
    PreActivation.prototype.setupRouteGuards = /**
     * Iterates over child routes and calls recursive `setupRouteGuards` to get `this` instance in
     * proper state to run `checkGuards()` method.
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} parentContexts
     * @param {?} futurePath
     * @return {?}
     */
    function (futureNode, currNode, parentContexts, futurePath) {
        var /** @type {?} */ future = futureNode.value;
        var /** @type {?} */ curr = currNode ? currNode.value : null;
        var /** @type {?} */ context = parentContexts ? parentContexts.getContext(futureNode.value.outlet) : null;
        // reusing the node
        if (curr && future.routeConfig === curr.routeConfig) {
            var /** @type {?} */ shouldRunGuardsAndResolvers = this.shouldRunGuardsAndResolvers(curr, future, /** @type {?} */ ((future.routeConfig)).runGuardsAndResolvers);
            if (shouldRunGuardsAndResolvers) {
                this.canActivateChecks.push(new CanActivate(futurePath));
            }
            else {
                // we need to set the data
                future.data = curr.data;
                future._resolvedData = curr._resolvedData;
            }
            // If we have a component, we need to go through an outlet.
            if (future.component) {
                this.setupChildRouteGuards(futureNode, currNode, context ? context.children : null, futurePath);
                // if we have a componentless route, we recurse but keep the same outlet map.
            }
            else {
                this.setupChildRouteGuards(futureNode, currNode, parentContexts, futurePath);
            }
            if (shouldRunGuardsAndResolvers) {
                var /** @type {?} */ outlet = /** @type {?} */ ((/** @type {?} */ ((context)).outlet));
                this.canDeactivateChecks.push(new CanDeactivate(outlet.component, curr));
            }
        }
        else {
            if (curr) {
                this.deactivateRouteAndItsChildren(currNode, context);
            }
            this.canActivateChecks.push(new CanActivate(futurePath));
            // If we have a component, we need to go through an outlet.
            if (future.component) {
                this.setupChildRouteGuards(futureNode, null, context ? context.children : null, futurePath);
                // if we have a componentless route, we recurse but keep the same outlet map.
            }
            else {
                this.setupChildRouteGuards(futureNode, null, parentContexts, futurePath);
            }
        }
    };
    /**
     * @param {?} curr
     * @param {?} future
     * @param {?} mode
     * @return {?}
     */
    PreActivation.prototype.shouldRunGuardsAndResolvers = /**
     * @param {?} curr
     * @param {?} future
     * @param {?} mode
     * @return {?}
     */
    function (curr, future, mode) {
        switch (mode) {
            case 'always':
                return true;
            case 'paramsOrQueryParamsChange':
                return !equalParamsAndUrlSegments(curr, future) ||
                    !shallowEqual(curr.queryParams, future.queryParams);
            case 'paramsChange':
            default:
                return !equalParamsAndUrlSegments(curr, future);
        }
    };
    /**
     * @param {?} route
     * @param {?} context
     * @return {?}
     */
    PreActivation.prototype.deactivateRouteAndItsChildren = /**
     * @param {?} route
     * @param {?} context
     * @return {?}
     */
    function (route, context) {
        var _this = this;
        var /** @type {?} */ children = nodeChildrenAsMap(route);
        var /** @type {?} */ r = route.value;
        forEach(children, function (node, childName) {
            if (!r.component) {
                _this.deactivateRouteAndItsChildren(node, context);
            }
            else if (context) {
                _this.deactivateRouteAndItsChildren(node, context.children.getContext(childName));
            }
            else {
                _this.deactivateRouteAndItsChildren(node, null);
            }
        });
        if (!r.component) {
            this.canDeactivateChecks.push(new CanDeactivate(null, r));
        }
        else if (context && context.outlet && context.outlet.isActivated) {
            this.canDeactivateChecks.push(new CanDeactivate(context.outlet.component, r));
        }
        else {
            this.canDeactivateChecks.push(new CanDeactivate(null, r));
        }
    };
    /**
     * @return {?}
     */
    PreActivation.prototype.runCanDeactivateChecks = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ checks$ = from(this.canDeactivateChecks);
        var /** @type {?} */ runningChecks$ = mergeMap.call(checks$, function (check) { return _this.runCanDeactivate(check.component, check.route); });
        return every.call(runningChecks$, function (result) { return result === true; });
    };
    /**
     * @return {?}
     */
    PreActivation.prototype.runCanActivateChecks = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ checks$ = from(this.canActivateChecks);
        var /** @type {?} */ runningChecks$ = concatMap.call(checks$, function (check) {
            return andObservables(from([
                _this.fireChildActivationStart(check.route.parent), _this.fireActivationStart(check.route),
                _this.runCanActivateChild(check.path), _this.runCanActivate(check.route)
            ]));
        });
        return every.call(runningChecks$, function (result) { return result === true; });
        // this.fireChildActivationStart(check.path),
    };
    /**
     * This should fire off `ActivationStart` events for each route being activated at this
     * level.
     * In other words, if you're activating `a` and `b` below, `path` will contain the
     * `ActivatedRouteSnapshot`s for both and we will fire `ActivationStart` for both. Always
     * return
     * `true` so checks continue to run.
     * @param {?} snapshot
     * @return {?}
     */
    PreActivation.prototype.fireActivationStart = /**
     * This should fire off `ActivationStart` events for each route being activated at this
     * level.
     * In other words, if you're activating `a` and `b` below, `path` will contain the
     * `ActivatedRouteSnapshot`s for both and we will fire `ActivationStart` for both. Always
     * return
     * `true` so checks continue to run.
     * @param {?} snapshot
     * @return {?}
     */
    function (snapshot) {
        if (snapshot !== null && this.forwardEvent) {
            this.forwardEvent(new ActivationStart(snapshot));
        }
        return of(true);
    };
    /**
     * This should fire off `ChildActivationStart` events for each route being activated at this
     * level.
     * In other words, if you're activating `a` and `b` below, `path` will contain the
     * `ActivatedRouteSnapshot`s for both and we will fire `ChildActivationStart` for both. Always
     * return
     * `true` so checks continue to run.
     * @param {?} snapshot
     * @return {?}
     */
    PreActivation.prototype.fireChildActivationStart = /**
     * This should fire off `ChildActivationStart` events for each route being activated at this
     * level.
     * In other words, if you're activating `a` and `b` below, `path` will contain the
     * `ActivatedRouteSnapshot`s for both and we will fire `ChildActivationStart` for both. Always
     * return
     * `true` so checks continue to run.
     * @param {?} snapshot
     * @return {?}
     */
    function (snapshot) {
        if (snapshot !== null && this.forwardEvent) {
            this.forwardEvent(new ChildActivationStart(snapshot));
        }
        return of(true);
    };
    /**
     * @param {?} future
     * @return {?}
     */
    PreActivation.prototype.runCanActivate = /**
     * @param {?} future
     * @return {?}
     */
    function (future) {
        var _this = this;
        var /** @type {?} */ canActivate = future.routeConfig ? future.routeConfig.canActivate : null;
        if (!canActivate || canActivate.length === 0)
            return of(true);
        var /** @type {?} */ obs = map.call(from(canActivate), function (c) {
            var /** @type {?} */ guard = _this.getToken(c, future);
            var /** @type {?} */ observable;
            if (guard.canActivate) {
                observable = wrapIntoObservable(guard.canActivate(future, _this.future));
            }
            else {
                observable = wrapIntoObservable(guard(future, _this.future));
            }
            return first.call(observable);
        });
        return andObservables(obs);
    };
    /**
     * @param {?} path
     * @return {?}
     */
    PreActivation.prototype.runCanActivateChild = /**
     * @param {?} path
     * @return {?}
     */
    function (path) {
        var _this = this;
        var /** @type {?} */ future = path[path.length - 1];
        var /** @type {?} */ canActivateChildGuards = path.slice(0, path.length - 1)
            .reverse()
            .map(function (p) { return _this.extractCanActivateChild(p); })
            .filter(function (_) { return _ !== null; });
        return andObservables(map.call(from(canActivateChildGuards), function (d) {
            var /** @type {?} */ obs = map.call(from(d.guards), function (c) {
                var /** @type {?} */ guard = _this.getToken(c, d.node);
                var /** @type {?} */ observable;
                if (guard.canActivateChild) {
                    observable = wrapIntoObservable(guard.canActivateChild(future, _this.future));
                }
                else {
                    observable = wrapIntoObservable(guard(future, _this.future));
                }
                return first.call(observable);
            });
            return andObservables(obs);
        }));
    };
    /**
     * @param {?} p
     * @return {?}
     */
    PreActivation.prototype.extractCanActivateChild = /**
     * @param {?} p
     * @return {?}
     */
    function (p) {
        var /** @type {?} */ canActivateChild = p.routeConfig ? p.routeConfig.canActivateChild : null;
        if (!canActivateChild || canActivateChild.length === 0)
            return null;
        return { node: p, guards: canActivateChild };
    };
    /**
     * @param {?} component
     * @param {?} curr
     * @return {?}
     */
    PreActivation.prototype.runCanDeactivate = /**
     * @param {?} component
     * @param {?} curr
     * @return {?}
     */
    function (component, curr) {
        var _this = this;
        var /** @type {?} */ canDeactivate = curr && curr.routeConfig ? curr.routeConfig.canDeactivate : null;
        if (!canDeactivate || canDeactivate.length === 0)
            return of(true);
        var /** @type {?} */ canDeactivate$ = mergeMap.call(from(canDeactivate), function (c) {
            var /** @type {?} */ guard = _this.getToken(c, curr);
            var /** @type {?} */ observable;
            if (guard.canDeactivate) {
                observable =
                    wrapIntoObservable(guard.canDeactivate(component, curr, _this.curr, _this.future));
            }
            else {
                observable = wrapIntoObservable(guard(component, curr, _this.curr, _this.future));
            }
            return first.call(observable);
        });
        return every.call(canDeactivate$, function (result) { return result === true; });
    };
    /**
     * @param {?} future
     * @param {?} paramsInheritanceStrategy
     * @return {?}
     */
    PreActivation.prototype.runResolve = /**
     * @param {?} future
     * @param {?} paramsInheritanceStrategy
     * @return {?}
     */
    function (future, paramsInheritanceStrategy) {
        var /** @type {?} */ resolve = future._resolve;
        return map.call(this.resolveNode(resolve, future), function (resolvedData) {
            future._resolvedData = resolvedData;
            future.data = __assign({}, future.data, inheritedParamsDataResolve(future, paramsInheritanceStrategy).resolve);
            return null;
        });
    };
    /**
     * @param {?} resolve
     * @param {?} future
     * @return {?}
     */
    PreActivation.prototype.resolveNode = /**
     * @param {?} resolve
     * @param {?} future
     * @return {?}
     */
    function (resolve, future) {
        var _this = this;
        var /** @type {?} */ keys = Object.keys(resolve);
        if (keys.length === 0) {
            return of({});
        }
        if (keys.length === 1) {
            var /** @type {?} */ key_1 = keys[0];
            return map.call(this.getResolver(resolve[key_1], future), function (value) {
                return _a = {}, _a[key_1] = value, _a;
                var _a;
            });
        }
        var /** @type {?} */ data = {};
        var /** @type {?} */ runningResolvers$ = mergeMap.call(from(keys), function (key) {
            return map.call(_this.getResolver(resolve[key], future), function (value) {
                data[key] = value;
                return value;
            });
        });
        return map.call(last.call(runningResolvers$), function () { return data; });
    };
    /**
     * @param {?} injectionToken
     * @param {?} future
     * @return {?}
     */
    PreActivation.prototype.getResolver = /**
     * @param {?} injectionToken
     * @param {?} future
     * @return {?}
     */
    function (injectionToken, future) {
        var /** @type {?} */ resolver = this.getToken(injectionToken, future);
        return resolver.resolve ? wrapIntoObservable(resolver.resolve(future, this.future)) :
            wrapIntoObservable(resolver(future, this.future));
    };
    /**
     * @param {?} token
     * @param {?} snapshot
     * @return {?}
     */
    PreActivation.prototype.getToken = /**
     * @param {?} token
     * @param {?} snapshot
     * @return {?}
     */
    function (token, snapshot) {
        var /** @type {?} */ config = closestLoadedConfig(snapshot);
        var /** @type {?} */ injector = config ? config.module.injector : this.moduleInjector;
        return injector.get(token);
    };
    return PreActivation;
}());
/**
 * @param {?} snapshot
 * @return {?}
 */
function closestLoadedConfig(snapshot) {
    if (!snapshot)
        return null;
    for (var /** @type {?} */ s = snapshot.parent; s; s = s.parent) {
        var /** @type {?} */ route = s.routeConfig;
        if (route && route._loadedConfig)
            return route._loadedConfig;
    }
    return null;
}

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
var NoMatch$1 = /** @class */ (function () {
    function NoMatch() {
    }
    return NoMatch;
}());
/**
 * @param {?} rootComponentType
 * @param {?} config
 * @param {?} urlTree
 * @param {?} url
 * @param {?=} paramsInheritanceStrategy
 * @return {?}
 */
function recognize(rootComponentType, config, urlTree, url, paramsInheritanceStrategy) {
    if (paramsInheritanceStrategy === void 0) { paramsInheritanceStrategy = 'emptyOnly'; }
    return new Recognizer(rootComponentType, config, urlTree, url, paramsInheritanceStrategy)
        .recognize();
}
var Recognizer = /** @class */ (function () {
    function Recognizer(rootComponentType, config, urlTree, url, paramsInheritanceStrategy) {
        this.rootComponentType = rootComponentType;
        this.config = config;
        this.urlTree = urlTree;
        this.url = url;
        this.paramsInheritanceStrategy = paramsInheritanceStrategy;
    }
    /**
     * @return {?}
     */
    Recognizer.prototype.recognize = /**
     * @return {?}
     */
    function () {
        try {
            var /** @type {?} */ rootSegmentGroup = split$1(this.urlTree.root, [], [], this.config).segmentGroup;
            var /** @type {?} */ children = this.processSegmentGroup(this.config, rootSegmentGroup, PRIMARY_OUTLET);
            var /** @type {?} */ root = new ActivatedRouteSnapshot([], Object.freeze({}), Object.freeze(this.urlTree.queryParams), /** @type {?} */ ((this.urlTree.fragment)), {}, PRIMARY_OUTLET, this.rootComponentType, null, this.urlTree.root, -1, {});
            var /** @type {?} */ rootNode = new TreeNode(root, children);
            var /** @type {?} */ routeState = new RouterStateSnapshot(this.url, rootNode);
            this.inheritParamsAndData(routeState._root);
            return of(routeState);
        }
        catch (/** @type {?} */ e) {
            return new Observable(function (obs) { return obs.error(e); });
        }
    };
    /**
     * @param {?} routeNode
     * @return {?}
     */
    Recognizer.prototype.inheritParamsAndData = /**
     * @param {?} routeNode
     * @return {?}
     */
    function (routeNode) {
        var _this = this;
        var /** @type {?} */ route = routeNode.value;
        var /** @type {?} */ i = inheritedParamsDataResolve(route, this.paramsInheritanceStrategy);
        route.params = Object.freeze(i.params);
        route.data = Object.freeze(i.data);
        routeNode.children.forEach(function (n) { return _this.inheritParamsAndData(n); });
    };
    /**
     * @param {?} config
     * @param {?} segmentGroup
     * @param {?} outlet
     * @return {?}
     */
    Recognizer.prototype.processSegmentGroup = /**
     * @param {?} config
     * @param {?} segmentGroup
     * @param {?} outlet
     * @return {?}
     */
    function (config, segmentGroup, outlet) {
        if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
            return this.processChildren(config, segmentGroup);
        }
        return this.processSegment(config, segmentGroup, segmentGroup.segments, outlet);
    };
    /**
     * @param {?} config
     * @param {?} segmentGroup
     * @return {?}
     */
    Recognizer.prototype.processChildren = /**
     * @param {?} config
     * @param {?} segmentGroup
     * @return {?}
     */
    function (config, segmentGroup) {
        var _this = this;
        var /** @type {?} */ children = mapChildrenIntoArray(segmentGroup, function (child, childOutlet) { return _this.processSegmentGroup(config, child, childOutlet); });
        checkOutletNameUniqueness(children);
        sortActivatedRouteSnapshots(children);
        return children;
    };
    /**
     * @param {?} config
     * @param {?} segmentGroup
     * @param {?} segments
     * @param {?} outlet
     * @return {?}
     */
    Recognizer.prototype.processSegment = /**
     * @param {?} config
     * @param {?} segmentGroup
     * @param {?} segments
     * @param {?} outlet
     * @return {?}
     */
    function (config, segmentGroup, segments, outlet) {
        for (var _i = 0, config_1 = config; _i < config_1.length; _i++) {
            var r = config_1[_i];
            try {
                return this.processSegmentAgainstRoute(r, segmentGroup, segments, outlet);
            }
            catch (/** @type {?} */ e) {
                if (!(e instanceof NoMatch$1))
                    throw e;
            }
        }
        if (this.noLeftoversInUrl(segmentGroup, segments, outlet)) {
            return [];
        }
        throw new NoMatch$1();
    };
    /**
     * @param {?} segmentGroup
     * @param {?} segments
     * @param {?} outlet
     * @return {?}
     */
    Recognizer.prototype.noLeftoversInUrl = /**
     * @param {?} segmentGroup
     * @param {?} segments
     * @param {?} outlet
     * @return {?}
     */
    function (segmentGroup, segments, outlet) {
        return segments.length === 0 && !segmentGroup.children[outlet];
    };
    /**
     * @param {?} route
     * @param {?} rawSegment
     * @param {?} segments
     * @param {?} outlet
     * @return {?}
     */
    Recognizer.prototype.processSegmentAgainstRoute = /**
     * @param {?} route
     * @param {?} rawSegment
     * @param {?} segments
     * @param {?} outlet
     * @return {?}
     */
    function (route, rawSegment, segments, outlet) {
        if (route.redirectTo)
            throw new NoMatch$1();
        if ((route.outlet || PRIMARY_OUTLET) !== outlet)
            throw new NoMatch$1();
        var /** @type {?} */ snapshot;
        var /** @type {?} */ consumedSegments = [];
        var /** @type {?} */ rawSlicedSegments = [];
        if (route.path === '**') {
            var /** @type {?} */ params = segments.length > 0 ? /** @type {?} */ ((last$1(segments))).parameters : {};
            snapshot = new ActivatedRouteSnapshot(segments, params, Object.freeze(this.urlTree.queryParams), /** @type {?} */ ((this.urlTree.fragment)), getData(route), outlet, /** @type {?} */ ((route.component)), route, getSourceSegmentGroup(rawSegment), getPathIndexShift(rawSegment) + segments.length, getResolve(route));
        }
        else {
            var /** @type {?} */ result = match$1(rawSegment, route, segments);
            consumedSegments = result.consumedSegments;
            rawSlicedSegments = segments.slice(result.lastChild);
            snapshot = new ActivatedRouteSnapshot(consumedSegments, result.parameters, Object.freeze(this.urlTree.queryParams), /** @type {?} */ ((this.urlTree.fragment)), getData(route), outlet, /** @type {?} */ ((route.component)), route, getSourceSegmentGroup(rawSegment), getPathIndexShift(rawSegment) + consumedSegments.length, getResolve(route));
        }
        var /** @type {?} */ childConfig = getChildConfig(route);
        var _a = split$1(rawSegment, consumedSegments, rawSlicedSegments, childConfig), segmentGroup = _a.segmentGroup, slicedSegments = _a.slicedSegments;
        if (slicedSegments.length === 0 && segmentGroup.hasChildren()) {
            var /** @type {?} */ children_1 = this.processChildren(childConfig, segmentGroup);
            return [new TreeNode(snapshot, children_1)];
        }
        if (childConfig.length === 0 && slicedSegments.length === 0) {
            return [new TreeNode(snapshot, [])];
        }
        var /** @type {?} */ children = this.processSegment(childConfig, segmentGroup, slicedSegments, PRIMARY_OUTLET);
        return [new TreeNode(snapshot, children)];
    };
    return Recognizer;
}());
/**
 * @param {?} nodes
 * @return {?}
 */
function sortActivatedRouteSnapshots(nodes) {
    nodes.sort(function (a, b) {
        if (a.value.outlet === PRIMARY_OUTLET)
            return -1;
        if (b.value.outlet === PRIMARY_OUTLET)
            return 1;
        return a.value.outlet.localeCompare(b.value.outlet);
    });
}
/**
 * @param {?} route
 * @return {?}
 */
function getChildConfig(route) {
    if (route.children) {
        return route.children;
    }
    if (route.loadChildren) {
        return /** @type {?} */ ((route._loadedConfig)).routes;
    }
    return [];
}
/**
 * @param {?} segmentGroup
 * @param {?} route
 * @param {?} segments
 * @return {?}
 */
function match$1(segmentGroup, route, segments) {
    if (route.path === '') {
        if (route.pathMatch === 'full' && (segmentGroup.hasChildren() || segments.length > 0)) {
            throw new NoMatch$1();
        }
        return { consumedSegments: [], lastChild: 0, parameters: {} };
    }
    var /** @type {?} */ matcher = route.matcher || defaultUrlMatcher;
    var /** @type {?} */ res = matcher(segments, segmentGroup, route);
    if (!res)
        throw new NoMatch$1();
    var /** @type {?} */ posParams = {};
    forEach(/** @type {?} */ ((res.posParams)), function (v, k) { posParams[k] = v.path; });
    var /** @type {?} */ parameters = res.consumed.length > 0 ? __assign({}, posParams, res.consumed[res.consumed.length - 1].parameters) :
        posParams;
    return { consumedSegments: res.consumed, lastChild: res.consumed.length, parameters: parameters };
}
/**
 * @param {?} nodes
 * @return {?}
 */
function checkOutletNameUniqueness(nodes) {
    var /** @type {?} */ names = {};
    nodes.forEach(function (n) {
        var /** @type {?} */ routeWithSameOutletName = names[n.value.outlet];
        if (routeWithSameOutletName) {
            var /** @type {?} */ p = routeWithSameOutletName.url.map(function (s) { return s.toString(); }).join('/');
            var /** @type {?} */ c = n.value.url.map(function (s) { return s.toString(); }).join('/');
            throw new Error("Two segments cannot have the same outlet name: '" + p + "' and '" + c + "'.");
        }
        names[n.value.outlet] = n.value;
    });
}
/**
 * @param {?} segmentGroup
 * @return {?}
 */
function getSourceSegmentGroup(segmentGroup) {
    var /** @type {?} */ s = segmentGroup;
    while (s._sourceSegment) {
        s = s._sourceSegment;
    }
    return s;
}
/**
 * @param {?} segmentGroup
 * @return {?}
 */
function getPathIndexShift(segmentGroup) {
    var /** @type {?} */ s = segmentGroup;
    var /** @type {?} */ res = (s._segmentIndexShift ? s._segmentIndexShift : 0);
    while (s._sourceSegment) {
        s = s._sourceSegment;
        res += (s._segmentIndexShift ? s._segmentIndexShift : 0);
    }
    return res - 1;
}
/**
 * @param {?} segmentGroup
 * @param {?} consumedSegments
 * @param {?} slicedSegments
 * @param {?} config
 * @return {?}
 */
function split$1(segmentGroup, consumedSegments, slicedSegments, config) {
    if (slicedSegments.length > 0 &&
        containsEmptyPathMatchesWithNamedOutlets(segmentGroup, slicedSegments, config)) {
        var /** @type {?} */ s_1 = new UrlSegmentGroup(consumedSegments, createChildrenForEmptyPaths(segmentGroup, consumedSegments, config, new UrlSegmentGroup(slicedSegments, segmentGroup.children)));
        s_1._sourceSegment = segmentGroup;
        s_1._segmentIndexShift = consumedSegments.length;
        return { segmentGroup: s_1, slicedSegments: [] };
    }
    if (slicedSegments.length === 0 &&
        containsEmptyPathMatches(segmentGroup, slicedSegments, config)) {
        var /** @type {?} */ s_2 = new UrlSegmentGroup(segmentGroup.segments, addEmptyPathsToChildrenIfNeeded(segmentGroup, slicedSegments, config, segmentGroup.children));
        s_2._sourceSegment = segmentGroup;
        s_2._segmentIndexShift = consumedSegments.length;
        return { segmentGroup: s_2, slicedSegments: slicedSegments };
    }
    var /** @type {?} */ s = new UrlSegmentGroup(segmentGroup.segments, segmentGroup.children);
    s._sourceSegment = segmentGroup;
    s._segmentIndexShift = consumedSegments.length;
    return { segmentGroup: s, slicedSegments: slicedSegments };
}
/**
 * @param {?} segmentGroup
 * @param {?} slicedSegments
 * @param {?} routes
 * @param {?} children
 * @return {?}
 */
function addEmptyPathsToChildrenIfNeeded(segmentGroup, slicedSegments, routes, children) {
    var /** @type {?} */ res = {};
    for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
        var r = routes_1[_i];
        if (emptyPathMatch(segmentGroup, slicedSegments, r) && !children[getOutlet$1(r)]) {
            var /** @type {?} */ s = new UrlSegmentGroup([], {});
            s._sourceSegment = segmentGroup;
            s._segmentIndexShift = segmentGroup.segments.length;
            res[getOutlet$1(r)] = s;
        }
    }
    return __assign({}, children, res);
}
/**
 * @param {?} segmentGroup
 * @param {?} consumedSegments
 * @param {?} routes
 * @param {?} primarySegment
 * @return {?}
 */
function createChildrenForEmptyPaths(segmentGroup, consumedSegments, routes, primarySegment) {
    var /** @type {?} */ res = {};
    res[PRIMARY_OUTLET] = primarySegment;
    primarySegment._sourceSegment = segmentGroup;
    primarySegment._segmentIndexShift = consumedSegments.length;
    for (var _i = 0, routes_2 = routes; _i < routes_2.length; _i++) {
        var r = routes_2[_i];
        if (r.path === '' && getOutlet$1(r) !== PRIMARY_OUTLET) {
            var /** @type {?} */ s = new UrlSegmentGroup([], {});
            s._sourceSegment = segmentGroup;
            s._segmentIndexShift = consumedSegments.length;
            res[getOutlet$1(r)] = s;
        }
    }
    return res;
}
/**
 * @param {?} segmentGroup
 * @param {?} slicedSegments
 * @param {?} routes
 * @return {?}
 */
function containsEmptyPathMatchesWithNamedOutlets(segmentGroup, slicedSegments, routes) {
    return routes.some(function (r) { return emptyPathMatch(segmentGroup, slicedSegments, r) && getOutlet$1(r) !== PRIMARY_OUTLET; });
}
/**
 * @param {?} segmentGroup
 * @param {?} slicedSegments
 * @param {?} routes
 * @return {?}
 */
function containsEmptyPathMatches(segmentGroup, slicedSegments, routes) {
    return routes.some(function (r) { return emptyPathMatch(segmentGroup, slicedSegments, r); });
}
/**
 * @param {?} segmentGroup
 * @param {?} slicedSegments
 * @param {?} r
 * @return {?}
 */
function emptyPathMatch(segmentGroup, slicedSegments, r) {
    if ((segmentGroup.hasChildren() || slicedSegments.length > 0) && r.pathMatch === 'full') {
        return false;
    }
    return r.path === '' && r.redirectTo === undefined;
}
/**
 * @param {?} route
 * @return {?}
 */
function getOutlet$1(route) {
    return route.outlet || PRIMARY_OUTLET;
}
/**
 * @param {?} route
 * @return {?}
 */
function getData(route) {
    return route.data || {};
}
/**
 * @param {?} route
 * @return {?}
 */
function getResolve(route) {
    return route.resolve || {};
}

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
 * \@whatItDoes Provides a way to customize when activated routes get reused.
 *
 * \@experimental
 * @abstract
 */
var RouteReuseStrategy = /** @class */ (function () {
    function RouteReuseStrategy() {
    }
    return RouteReuseStrategy;
}());
/**
 * Does not detach any subtrees. Reuses routes as long as their route config is the same.
 */
var DefaultRouteReuseStrategy = /** @class */ (function () {
    function DefaultRouteReuseStrategy() {
    }
    /**
     * @param {?} route
     * @return {?}
     */
    DefaultRouteReuseStrategy.prototype.shouldDetach = /**
     * @param {?} route
     * @return {?}
     */
    function (route) { return false; };
    /**
     * @param {?} route
     * @param {?} detachedTree
     * @return {?}
     */
    DefaultRouteReuseStrategy.prototype.store = /**
     * @param {?} route
     * @param {?} detachedTree
     * @return {?}
     */
    function (route, detachedTree) { };
    /**
     * @param {?} route
     * @return {?}
     */
    DefaultRouteReuseStrategy.prototype.shouldAttach = /**
     * @param {?} route
     * @return {?}
     */
    function (route) { return false; };
    /**
     * @param {?} route
     * @return {?}
     */
    DefaultRouteReuseStrategy.prototype.retrieve = /**
     * @param {?} route
     * @return {?}
     */
    function (route) { return null; };
    /**
     * @param {?} future
     * @param {?} curr
     * @return {?}
     */
    DefaultRouteReuseStrategy.prototype.shouldReuseRoute = /**
     * @param {?} future
     * @param {?} curr
     * @return {?}
     */
    function (future, curr) {
        return future.routeConfig === curr.routeConfig;
    };
    return DefaultRouteReuseStrategy;
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
 * \@docsNotRequired
 * \@experimental
 */
var ROUTES = new InjectionToken('ROUTES');
var RouterConfigLoader = /** @class */ (function () {
    function RouterConfigLoader(loader, compiler, onLoadStartListener, onLoadEndListener) {
        this.loader = loader;
        this.compiler = compiler;
        this.onLoadStartListener = onLoadStartListener;
        this.onLoadEndListener = onLoadEndListener;
    }
    /**
     * @param {?} parentInjector
     * @param {?} route
     * @return {?}
     */
    RouterConfigLoader.prototype.load = /**
     * @param {?} parentInjector
     * @param {?} route
     * @return {?}
     */
    function (parentInjector, route) {
        var _this = this;
        if (this.onLoadStartListener) {
            this.onLoadStartListener(route);
        }
        var /** @type {?} */ moduleFactory$ = this.loadModuleFactory(/** @type {?} */ ((route.loadChildren)));
        return map.call(moduleFactory$, function (factory) {
            if (_this.onLoadEndListener) {
                _this.onLoadEndListener(route);
            }
            var /** @type {?} */ module = factory.create(parentInjector);
            return new LoadedRouterConfig(flatten(module.injector.get(ROUTES)), module);
        });
    };
    /**
     * @param {?} loadChildren
     * @return {?}
     */
    RouterConfigLoader.prototype.loadModuleFactory = /**
     * @param {?} loadChildren
     * @return {?}
     */
    function (loadChildren) {
        var _this = this;
        if (typeof loadChildren === 'string') {
            return fromPromise(this.loader.load(loadChildren));
        }
        else {
            return mergeMap.call(wrapIntoObservable(loadChildren()), function (t) {
                if (t instanceof NgModuleFactory) {
                    return of(t);
                }
                else {
                    return fromPromise(_this.compiler.compileModuleAsync(t));
                }
            });
        }
    };
    return RouterConfigLoader;
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
 * \@whatItDoes Provides a way to migrate AngularJS applications to Angular.
 *
 * \@experimental
 * @abstract
 */
var UrlHandlingStrategy = /** @class */ (function () {
    function UrlHandlingStrategy() {
    }
    return UrlHandlingStrategy;
}());
/**
 * \@experimental
 */
var DefaultUrlHandlingStrategy = /** @class */ (function () {
    function DefaultUrlHandlingStrategy() {
    }
    /**
     * @param {?} url
     * @return {?}
     */
    DefaultUrlHandlingStrategy.prototype.shouldProcessUrl = /**
     * @param {?} url
     * @return {?}
     */
    function (url) { return true; };
    /**
     * @param {?} url
     * @return {?}
     */
    DefaultUrlHandlingStrategy.prototype.extract = /**
     * @param {?} url
     * @return {?}
     */
    function (url) { return url; };
    /**
     * @param {?} newUrlPart
     * @param {?} wholeUrl
     * @return {?}
     */
    DefaultUrlHandlingStrategy.prototype.merge = /**
     * @param {?} newUrlPart
     * @param {?} wholeUrl
     * @return {?}
     */
    function (newUrlPart, wholeUrl) { return newUrlPart; };
    return DefaultUrlHandlingStrategy;
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
 * \@whatItDoes Represents the extra options used during navigation.
 *
 * \@stable
 * @record
 */

/**
 * @param {?} error
 * @return {?}
 */
function defaultErrorHandler(error) {
    throw error;
}
/**
 * \@internal
 * @param {?} snapshot
 * @return {?}
 */
function defaultRouterHook(snapshot) {
    return /** @type {?} */ (of(null));
}
/**
 * \@whatItDoes Provides the navigation and url manipulation capabilities.
 *
 * See {\@link Routes} for more details and examples.
 *
 * \@ngModule RouterModule
 *
 * \@stable
 */
var Router = /** @class */ (function () {
    /**
     * Creates the router service.
     */
    // TODO: vsavkin make internal after the final is out.
    function Router(rootComponentType, urlSerializer, rootContexts, location, injector, loader, compiler, config) {
        var _this = this;
        this.rootComponentType = rootComponentType;
        this.urlSerializer = urlSerializer;
        this.rootContexts = rootContexts;
        this.location = location;
        this.config = config;
        this.navigations = new BehaviorSubject(/** @type {?} */ ((null)));
        this.navigationId = 0;
        this.events = new Subject();
        /**
         * Error handler that is invoked when a navigation errors.
         *
         * See {\@link ErrorHandler} for more information.
         */
        this.errorHandler = defaultErrorHandler;
        /**
         * Indicates if at least one navigation happened.
         */
        this.navigated = false;
        this.lastSuccessfulId = -1;
        /**
         * Used by RouterModule. This allows us to
         * pause the navigation either before preactivation or after it.
         * \@internal
         */
        this.hooks = {
            beforePreactivation: defaultRouterHook,
            afterPreactivation: defaultRouterHook
        };
        /**
         * Extracts and merges URLs. Used for AngularJS to Angular migrations.
         */
        this.urlHandlingStrategy = new DefaultUrlHandlingStrategy();
        this.routeReuseStrategy = new DefaultRouteReuseStrategy();
        /**
         * Define what the router should do if it receives a navigation request to the current URL.
         * By default, the router will ignore this navigation. However, this prevents features such
         * as a "refresh" button. Use this option to configure the behavior when navigating to the
         * current URL. Default is 'ignore'.
         */
        this.onSameUrlNavigation = 'ignore';
        /**
         * Defines how the router merges params, data and resolved data from parent to child
         * routes. Available options are:
         *
         * - `'emptyOnly'`, the default, only inherits parent params for path-less or component-less
         *   routes.
         * - `'always'`, enables unconditional inheritance of parent params.
         */
        this.paramsInheritanceStrategy = 'emptyOnly';
        var /** @type {?} */ onLoadStart = function (r) { return _this.triggerEvent(new RouteConfigLoadStart(r)); };
        var /** @type {?} */ onLoadEnd = function (r) { return _this.triggerEvent(new RouteConfigLoadEnd(r)); };
        this.ngModule = injector.get(NgModuleRef);
        this.resetConfig(config);
        this.currentUrlTree = createEmptyUrlTree();
        this.rawUrlTree = this.currentUrlTree;
        this.configLoader = new RouterConfigLoader(loader, compiler, onLoadStart, onLoadEnd);
        this.routerState = createEmptyState(this.currentUrlTree, this.rootComponentType);
        this.processNavigations();
    }
    /**
     * @internal
     * TODO: this should be removed once the constructor of the router made internal
     */
    /**
     * \@internal
     * TODO: this should be removed once the constructor of the router made internal
     * @param {?} rootComponentType
     * @return {?}
     */
    Router.prototype.resetRootComponentType = /**
     * \@internal
     * TODO: this should be removed once the constructor of the router made internal
     * @param {?} rootComponentType
     * @return {?}
     */
    function (rootComponentType) {
        this.rootComponentType = rootComponentType;
        // TODO: vsavkin router 4.0 should make the root component set to null
        // this will simplify the lifecycle of the router.
        this.routerState.root.component = this.rootComponentType;
    };
    /**
     * Sets up the location change listener and performs the initial navigation.
     */
    /**
     * Sets up the location change listener and performs the initial navigation.
     * @return {?}
     */
    Router.prototype.initialNavigation = /**
     * Sets up the location change listener and performs the initial navigation.
     * @return {?}
     */
    function () {
        this.setUpLocationChangeListener();
        if (this.navigationId === 0) {
            this.navigateByUrl(this.location.path(true), { replaceUrl: true });
        }
    };
    /**
     * Sets up the location change listener.
     */
    /**
     * Sets up the location change listener.
     * @return {?}
     */
    Router.prototype.setUpLocationChangeListener = /**
     * Sets up the location change listener.
     * @return {?}
     */
    function () {
        var _this = this;
        // Don't need to use Zone.wrap any more, because zone.js
        // already patch onPopState, so location change callback will
        // run into ngZone
        if (!this.locationSubscription) {
            this.locationSubscription = /** @type {?} */ (this.location.subscribe(function (change) {
                var /** @type {?} */ rawUrlTree = _this.urlSerializer.parse(change['url']);
                var /** @type {?} */ source = change['type'] === 'popstate' ? 'popstate' : 'hashchange';
                var /** @type {?} */ state = change.state && change.state.navigationId ?
                    { navigationId: change.state.navigationId } :
                    null;
                setTimeout(function () { _this.scheduleNavigation(rawUrlTree, source, state, { replaceUrl: true }); }, 0);
            }));
        }
    };
    Object.defineProperty(Router.prototype, "url", {
        /** The current url */
        get: /**
         * The current url
         * @return {?}
         */
        function () { return this.serializeUrl(this.currentUrlTree); },
        enumerable: true,
        configurable: true
    });
    /** @internal */
    /**
     * \@internal
     * @param {?} e
     * @return {?}
     */
    Router.prototype.triggerEvent = /**
     * \@internal
     * @param {?} e
     * @return {?}
     */
    function (e) { (/** @type {?} */ (this.events)).next(e); };
    /**
     * Resets the configuration used for navigation and generating links.
     *
     * ### Usage
     *
     * ```
     * router.resetConfig([
     *  { path: 'team/:id', component: TeamCmp, children: [
     *    { path: 'simple', component: SimpleCmp },
     *    { path: 'user/:name', component: UserCmp }
     *  ]}
     * ]);
     * ```
     */
    /**
     * Resets the configuration used for navigation and generating links.
     *
     * ### Usage
     *
     * ```
     * router.resetConfig([
     *  { path: 'team/:id', component: TeamCmp, children: [
     *    { path: 'simple', component: SimpleCmp },
     *    { path: 'user/:name', component: UserCmp }
     *  ]}
     * ]);
     * ```
     * @param {?} config
     * @return {?}
     */
    Router.prototype.resetConfig = /**
     * Resets the configuration used for navigation and generating links.
     *
     * ### Usage
     *
     * ```
     * router.resetConfig([
     *  { path: 'team/:id', component: TeamCmp, children: [
     *    { path: 'simple', component: SimpleCmp },
     *    { path: 'user/:name', component: UserCmp }
     *  ]}
     * ]);
     * ```
     * @param {?} config
     * @return {?}
     */
    function (config) {
        validateConfig(config);
        this.config = config;
        this.navigated = false;
        this.lastSuccessfulId = -1;
    };
    /** @docsNotRequired */
    /**
     * \@docsNotRequired
     * @return {?}
     */
    Router.prototype.ngOnDestroy = /**
     * \@docsNotRequired
     * @return {?}
     */
    function () { this.dispose(); };
    /** Disposes of the router */
    /**
     * Disposes of the router
     * @return {?}
     */
    Router.prototype.dispose = /**
     * Disposes of the router
     * @return {?}
     */
    function () {
        if (this.locationSubscription) {
            this.locationSubscription.unsubscribe();
            this.locationSubscription = /** @type {?} */ ((null));
        }
    };
    /**
     * Applies an array of commands to the current url tree and creates a new url tree.
     *
     * When given an activate route, applies the given commands starting from the route.
     * When not given a route, applies the given command starting from the root.
     *
     * ### Usage
     *
     * ```
     * // create /team/33/user/11
     * router.createUrlTree(['/team', 33, 'user', 11]);
     *
     * // create /team/33;expand=true/user/11
     * router.createUrlTree(['/team', 33, {expand: true}, 'user', 11]);
     *
     * // you can collapse static segments like this (this works only with the first passed-in value):
     * router.createUrlTree(['/team/33/user', userId]);
     *
     * // If the first segment can contain slashes, and you do not want the router to split it, you
     * // can do the following:
     *
     * router.createUrlTree([{segmentPath: '/one/two'}]);
     *
     * // create /team/33/(user/11//right:chat)
     * router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: 'chat'}}]);
     *
     * // remove the right secondary node
     * router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: null}}]);
     *
     * // assuming the current url is `/team/33/user/11` and the route points to `user/11`
     *
     * // navigate to /team/33/user/11/details
     * router.createUrlTree(['details'], {relativeTo: route});
     *
     * // navigate to /team/33/user/22
     * router.createUrlTree(['../22'], {relativeTo: route});
     *
     * // navigate to /team/44/user/22
     * router.createUrlTree(['../../team/44/user/22'], {relativeTo: route});
     * ```
     */
    /**
     * Applies an array of commands to the current url tree and creates a new url tree.
     *
     * When given an activate route, applies the given commands starting from the route.
     * When not given a route, applies the given command starting from the root.
     *
     * ### Usage
     *
     * ```
     * // create /team/33/user/11
     * router.createUrlTree(['/team', 33, 'user', 11]);
     *
     * // create /team/33;expand=true/user/11
     * router.createUrlTree(['/team', 33, {expand: true}, 'user', 11]);
     *
     * // you can collapse static segments like this (this works only with the first passed-in value):
     * router.createUrlTree(['/team/33/user', userId]);
     *
     * // If the first segment can contain slashes, and you do not want the router to split it, you
     * // can do the following:
     *
     * router.createUrlTree([{segmentPath: '/one/two'}]);
     *
     * // create /team/33/(user/11//right:chat)
     * router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: 'chat'}}]);
     *
     * // remove the right secondary node
     * router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: null}}]);
     *
     * // assuming the current url is `/team/33/user/11` and the route points to `user/11`
     *
     * // navigate to /team/33/user/11/details
     * router.createUrlTree(['details'], {relativeTo: route});
     *
     * // navigate to /team/33/user/22
     * router.createUrlTree(['../22'], {relativeTo: route});
     *
     * // navigate to /team/44/user/22
     * router.createUrlTree(['../../team/44/user/22'], {relativeTo: route});
     * ```
     * @param {?} commands
     * @param {?=} navigationExtras
     * @return {?}
     */
    Router.prototype.createUrlTree = /**
     * Applies an array of commands to the current url tree and creates a new url tree.
     *
     * When given an activate route, applies the given commands starting from the route.
     * When not given a route, applies the given command starting from the root.
     *
     * ### Usage
     *
     * ```
     * // create /team/33/user/11
     * router.createUrlTree(['/team', 33, 'user', 11]);
     *
     * // create /team/33;expand=true/user/11
     * router.createUrlTree(['/team', 33, {expand: true}, 'user', 11]);
     *
     * // you can collapse static segments like this (this works only with the first passed-in value):
     * router.createUrlTree(['/team/33/user', userId]);
     *
     * // If the first segment can contain slashes, and you do not want the router to split it, you
     * // can do the following:
     *
     * router.createUrlTree([{segmentPath: '/one/two'}]);
     *
     * // create /team/33/(user/11//right:chat)
     * router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: 'chat'}}]);
     *
     * // remove the right secondary node
     * router.createUrlTree(['/team', 33, {outlets: {primary: 'user/11', right: null}}]);
     *
     * // assuming the current url is `/team/33/user/11` and the route points to `user/11`
     *
     * // navigate to /team/33/user/11/details
     * router.createUrlTree(['details'], {relativeTo: route});
     *
     * // navigate to /team/33/user/22
     * router.createUrlTree(['../22'], {relativeTo: route});
     *
     * // navigate to /team/44/user/22
     * router.createUrlTree(['../../team/44/user/22'], {relativeTo: route});
     * ```
     * @param {?} commands
     * @param {?=} navigationExtras
     * @return {?}
     */
    function (commands, navigationExtras) {
        if (navigationExtras === void 0) { navigationExtras = {}; }
        var relativeTo = navigationExtras.relativeTo, queryParams = navigationExtras.queryParams, fragment = navigationExtras.fragment, preserveQueryParams = navigationExtras.preserveQueryParams, queryParamsHandling = navigationExtras.queryParamsHandling, preserveFragment = navigationExtras.preserveFragment;
        if (isDevMode() && preserveQueryParams && /** @type {?} */ (console) && /** @type {?} */ (console.warn)) {
            console.warn('preserveQueryParams is deprecated, use queryParamsHandling instead.');
        }
        var /** @type {?} */ a = relativeTo || this.routerState.root;
        var /** @type {?} */ f = preserveFragment ? this.currentUrlTree.fragment : fragment;
        var /** @type {?} */ q = null;
        if (queryParamsHandling) {
            switch (queryParamsHandling) {
                case 'merge':
                    q = __assign({}, this.currentUrlTree.queryParams, queryParams);
                    break;
                case 'preserve':
                    q = this.currentUrlTree.queryParams;
                    break;
                default:
                    q = queryParams || null;
            }
        }
        else {
            q = preserveQueryParams ? this.currentUrlTree.queryParams : queryParams || null;
        }
        if (q !== null) {
            q = this.removeEmptyProps(q);
        }
        return createUrlTree(a, this.currentUrlTree, commands, /** @type {?} */ ((q)), /** @type {?} */ ((f)));
    };
    /**
     * Navigate based on the provided url. This navigation is always absolute.
     *
     * Returns a promise that:
     * - resolves to 'true' when navigation succeeds,
     * - resolves to 'false' when navigation fails,
     * - is rejected when an error happens.
     *
     * ### Usage
     *
     * ```
     * router.navigateByUrl("/team/33/user/11");
     *
     * // Navigate without updating the URL
     * router.navigateByUrl("/team/33/user/11", { skipLocationChange: true });
     * ```
     *
     * In opposite to `navigate`, `navigateByUrl` takes a whole URL
     * and does not apply any delta to the current one.
     */
    /**
     * Navigate based on the provided url. This navigation is always absolute.
     *
     * Returns a promise that:
     * - resolves to 'true' when navigation succeeds,
     * - resolves to 'false' when navigation fails,
     * - is rejected when an error happens.
     *
     * ### Usage
     *
     * ```
     * router.navigateByUrl("/team/33/user/11");
     *
     * // Navigate without updating the URL
     * router.navigateByUrl("/team/33/user/11", { skipLocationChange: true });
     * ```
     *
     * In opposite to `navigate`, `navigateByUrl` takes a whole URL
     * and does not apply any delta to the current one.
     * @param {?} url
     * @param {?=} extras
     * @return {?}
     */
    Router.prototype.navigateByUrl = /**
     * Navigate based on the provided url. This navigation is always absolute.
     *
     * Returns a promise that:
     * - resolves to 'true' when navigation succeeds,
     * - resolves to 'false' when navigation fails,
     * - is rejected when an error happens.
     *
     * ### Usage
     *
     * ```
     * router.navigateByUrl("/team/33/user/11");
     *
     * // Navigate without updating the URL
     * router.navigateByUrl("/team/33/user/11", { skipLocationChange: true });
     * ```
     *
     * In opposite to `navigate`, `navigateByUrl` takes a whole URL
     * and does not apply any delta to the current one.
     * @param {?} url
     * @param {?=} extras
     * @return {?}
     */
    function (url, extras) {
        if (extras === void 0) { extras = { skipLocationChange: false }; }
        var /** @type {?} */ urlTree = url instanceof UrlTree ? url : this.parseUrl(url);
        var /** @type {?} */ mergedTree = this.urlHandlingStrategy.merge(urlTree, this.rawUrlTree);
        return this.scheduleNavigation(mergedTree, 'imperative', null, extras);
    };
    /**
     * Navigate based on the provided array of commands and a starting point.
     * If no starting route is provided, the navigation is absolute.
     *
     * Returns a promise that:
     * - resolves to 'true' when navigation succeeds,
     * - resolves to 'false' when navigation fails,
     * - is rejected when an error happens.
     *
     * ### Usage
     *
     * ```
     * router.navigate(['team', 33, 'user', 11], {relativeTo: route});
     *
     * // Navigate without updating the URL
     * router.navigate(['team', 33, 'user', 11], {relativeTo: route, skipLocationChange: true});
     * ```
     *
     * In opposite to `navigateByUrl`, `navigate` always takes a delta that is applied to the current
     * URL.
     */
    /**
     * Navigate based on the provided array of commands and a starting point.
     * If no starting route is provided, the navigation is absolute.
     *
     * Returns a promise that:
     * - resolves to 'true' when navigation succeeds,
     * - resolves to 'false' when navigation fails,
     * - is rejected when an error happens.
     *
     * ### Usage
     *
     * ```
     * router.navigate(['team', 33, 'user', 11], {relativeTo: route});
     *
     * // Navigate without updating the URL
     * router.navigate(['team', 33, 'user', 11], {relativeTo: route, skipLocationChange: true});
     * ```
     *
     * In opposite to `navigateByUrl`, `navigate` always takes a delta that is applied to the current
     * URL.
     * @param {?} commands
     * @param {?=} extras
     * @return {?}
     */
    Router.prototype.navigate = /**
     * Navigate based on the provided array of commands and a starting point.
     * If no starting route is provided, the navigation is absolute.
     *
     * Returns a promise that:
     * - resolves to 'true' when navigation succeeds,
     * - resolves to 'false' when navigation fails,
     * - is rejected when an error happens.
     *
     * ### Usage
     *
     * ```
     * router.navigate(['team', 33, 'user', 11], {relativeTo: route});
     *
     * // Navigate without updating the URL
     * router.navigate(['team', 33, 'user', 11], {relativeTo: route, skipLocationChange: true});
     * ```
     *
     * In opposite to `navigateByUrl`, `navigate` always takes a delta that is applied to the current
     * URL.
     * @param {?} commands
     * @param {?=} extras
     * @return {?}
     */
    function (commands, extras) {
        if (extras === void 0) { extras = { skipLocationChange: false }; }
        validateCommands(commands);
        return this.navigateByUrl(this.createUrlTree(commands, extras), extras);
    };
    /** Serializes a {@link UrlTree} into a string */
    /**
     * Serializes a {\@link UrlTree} into a string
     * @param {?} url
     * @return {?}
     */
    Router.prototype.serializeUrl = /**
     * Serializes a {\@link UrlTree} into a string
     * @param {?} url
     * @return {?}
     */
    function (url) { return this.urlSerializer.serialize(url); };
    /** Parses a string into a {@link UrlTree} */
    /**
     * Parses a string into a {\@link UrlTree}
     * @param {?} url
     * @return {?}
     */
    Router.prototype.parseUrl = /**
     * Parses a string into a {\@link UrlTree}
     * @param {?} url
     * @return {?}
     */
    function (url) { return this.urlSerializer.parse(url); };
    /** Returns whether the url is activated */
    /**
     * Returns whether the url is activated
     * @param {?} url
     * @param {?} exact
     * @return {?}
     */
    Router.prototype.isActive = /**
     * Returns whether the url is activated
     * @param {?} url
     * @param {?} exact
     * @return {?}
     */
    function (url, exact) {
        if (url instanceof UrlTree) {
            return containsTree(this.currentUrlTree, url, exact);
        }
        var /** @type {?} */ urlTree = this.urlSerializer.parse(url);
        return containsTree(this.currentUrlTree, urlTree, exact);
    };
    /**
     * @param {?} params
     * @return {?}
     */
    Router.prototype.removeEmptyProps = /**
     * @param {?} params
     * @return {?}
     */
    function (params) {
        return Object.keys(params).reduce(function (result, key) {
            var /** @type {?} */ value = params[key];
            if (value !== null && value !== undefined) {
                result[key] = value;
            }
            return result;
        }, {});
    };
    /**
     * @return {?}
     */
    Router.prototype.processNavigations = /**
     * @return {?}
     */
    function () {
        var _this = this;
        concatMap
            .call(this.navigations, function (nav) {
            if (nav) {
                _this.executeScheduledNavigation(nav);
                // a failed navigation should not stop the router from processing
                // further navigations => the catch
                return nav.promise.catch(function () { });
            }
            else {
                return /** @type {?} */ (of(null));
            }
        })
            .subscribe(function () { });
    };
    /**
     * @param {?} rawUrl
     * @param {?} source
     * @param {?} state
     * @param {?} extras
     * @return {?}
     */
    Router.prototype.scheduleNavigation = /**
     * @param {?} rawUrl
     * @param {?} source
     * @param {?} state
     * @param {?} extras
     * @return {?}
     */
    function (rawUrl, source, state, extras) {
        var /** @type {?} */ lastNavigation = this.navigations.value;
        // If the user triggers a navigation imperatively (e.g., by using navigateByUrl),
        // and that navigation results in 'replaceState' that leads to the same URL,
        // we should skip those.
        if (lastNavigation && source !== 'imperative' && lastNavigation.source === 'imperative' &&
            lastNavigation.rawUrl.toString() === rawUrl.toString()) {
            return Promise.resolve(true); // return value is not used
        }
        // Because of a bug in IE and Edge, the location class fires two events (popstate and
        // hashchange) every single time. The second one should be ignored. Otherwise, the URL will
        // flicker. Handles the case when a popstate was emitted first.
        if (lastNavigation && source == 'hashchange' && lastNavigation.source === 'popstate' &&
            lastNavigation.rawUrl.toString() === rawUrl.toString()) {
            return Promise.resolve(true); // return value is not used
        }
        // Because of a bug in IE and Edge, the location class fires two events (popstate and
        // hashchange) every single time. The second one should be ignored. Otherwise, the URL will
        // flicker. Handles the case when a hashchange was emitted first.
        if (lastNavigation && source == 'popstate' && lastNavigation.source === 'hashchange' &&
            lastNavigation.rawUrl.toString() === rawUrl.toString()) {
            return Promise.resolve(true); // return value is not used
        }
        var /** @type {?} */ resolve = null;
        var /** @type {?} */ reject = null;
        var /** @type {?} */ promise = new Promise(function (res, rej) {
            resolve = res;
            reject = rej;
        });
        var /** @type {?} */ id = ++this.navigationId;
        this.navigations.next({ id: id, source: source, state: state, rawUrl: rawUrl, extras: extras, resolve: resolve, reject: reject, promise: promise });
        // Make sure that the error is propagated even though `processNavigations` catch
        // handler does not rethrow
        return promise.catch(function (e) { return Promise.reject(e); });
    };
    /**
     * @param {?} __0
     * @return {?}
     */
    Router.prototype.executeScheduledNavigation = /**
     * @param {?} __0
     * @return {?}
     */
    function (_a) {
        var _this = this;
        var id = _a.id, rawUrl = _a.rawUrl, extras = _a.extras, resolve = _a.resolve, reject = _a.reject, source = _a.source, state = _a.state;
        var /** @type {?} */ url = this.urlHandlingStrategy.extract(rawUrl);
        var /** @type {?} */ urlTransition = !this.navigated || url.toString() !== this.currentUrlTree.toString();
        if ((this.onSameUrlNavigation === 'reload' ? true : urlTransition) &&
            this.urlHandlingStrategy.shouldProcessUrl(rawUrl)) {
            (/** @type {?} */ (this.events))
                .next(new NavigationStart(id, this.serializeUrl(url), source, state));
            Promise.resolve()
                .then(function (_) {
                return _this.runNavigate(url, rawUrl, !!extras.skipLocationChange, !!extras.replaceUrl, id, null);
            })
                .then(resolve, reject);
            // we cannot process the current URL, but we could process the previous one =>
            // we need to do some cleanup
        }
        else if (urlTransition && this.rawUrlTree &&
            this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)) {
            (/** @type {?} */ (this.events))
                .next(new NavigationStart(id, this.serializeUrl(url), source, state));
            Promise.resolve()
                .then(function (_) {
                return _this.runNavigate(url, rawUrl, false, false, id, createEmptyState(url, _this.rootComponentType).snapshot);
            })
                .then(resolve, reject);
        }
        else {
            this.rawUrlTree = rawUrl;
            resolve(null);
        }
    };
    /**
     * @param {?} url
     * @param {?} rawUrl
     * @param {?} skipLocationChange
     * @param {?} replaceUrl
     * @param {?} id
     * @param {?} precreatedState
     * @return {?}
     */
    Router.prototype.runNavigate = /**
     * @param {?} url
     * @param {?} rawUrl
     * @param {?} skipLocationChange
     * @param {?} replaceUrl
     * @param {?} id
     * @param {?} precreatedState
     * @return {?}
     */
    function (url, rawUrl, skipLocationChange, replaceUrl, id, precreatedState) {
        var _this = this;
        if (id !== this.navigationId) {
            (/** @type {?} */ (this.events))
                .next(new NavigationCancel(id, this.serializeUrl(url), "Navigation ID " + id + " is not equal to the current navigation id " + this.navigationId));
            return Promise.resolve(false);
        }
        return new Promise(function (resolvePromise, rejectPromise) {
            // create an observable of the url and route state snapshot
            // this operation do not result in any side effects
            var /** @type {?} */ urlAndSnapshot$;
            if (!precreatedState) {
                var /** @type {?} */ moduleInjector = _this.ngModule.injector;
                var /** @type {?} */ redirectsApplied$ = applyRedirects(moduleInjector, _this.configLoader, _this.urlSerializer, url, _this.config);
                urlAndSnapshot$ = mergeMap.call(redirectsApplied$, function (appliedUrl) {
                    return map.call(recognize(_this.rootComponentType, _this.config, appliedUrl, _this.serializeUrl(appliedUrl), _this.paramsInheritanceStrategy), function (snapshot) {
                        (/** @type {?} */ (_this.events))
                            .next(new RoutesRecognized(id, _this.serializeUrl(url), _this.serializeUrl(appliedUrl), snapshot));
                        return { appliedUrl: appliedUrl, snapshot: snapshot };
                    });
                });
            }
            else {
                urlAndSnapshot$ = of({ appliedUrl: url, snapshot: precreatedState });
            }
            var /** @type {?} */ beforePreactivationDone$ = mergeMap.call(urlAndSnapshot$, function (p) {
                return map.call(_this.hooks.beforePreactivation(p.snapshot), function () { return p; });
            });
            // run preactivation: guards and data resolvers
            var /** @type {?} */ preActivation;
            var /** @type {?} */ preactivationSetup$ = map.call(beforePreactivationDone$, function (_a) {
                var appliedUrl = _a.appliedUrl, snapshot = _a.snapshot;
                var /** @type {?} */ moduleInjector = _this.ngModule.injector;
                preActivation = new PreActivation(snapshot, _this.routerState.snapshot, moduleInjector, function (evt) { return _this.triggerEvent(evt); });
                preActivation.initialize(_this.rootContexts);
                return { appliedUrl: appliedUrl, snapshot: snapshot };
            });
            var /** @type {?} */ preactivationCheckGuards$ = mergeMap.call(preactivationSetup$, function (_a) {
                var appliedUrl = _a.appliedUrl, snapshot = _a.snapshot;
                if (_this.navigationId !== id)
                    return of(false);
                _this.triggerEvent(new GuardsCheckStart(id, _this.serializeUrl(url), appliedUrl, snapshot));
                return map.call(preActivation.checkGuards(), function (shouldActivate) {
                    _this.triggerEvent(new GuardsCheckEnd(id, _this.serializeUrl(url), appliedUrl, snapshot, shouldActivate));
                    return { appliedUrl: appliedUrl, snapshot: snapshot, shouldActivate: shouldActivate };
                });
            });
            var /** @type {?} */ preactivationResolveData$ = mergeMap.call(preactivationCheckGuards$, function (p) {
                if (_this.navigationId !== id)
                    return of(false);
                if (p.shouldActivate && preActivation.isActivating()) {
                    _this.triggerEvent(new ResolveStart(id, _this.serializeUrl(url), p.appliedUrl, p.snapshot));
                    return map.call(preActivation.resolveData(_this.paramsInheritanceStrategy), function () {
                        _this.triggerEvent(new ResolveEnd(id, _this.serializeUrl(url), p.appliedUrl, p.snapshot));
                        return p;
                    });
                }
                else {
                    return of(p);
                }
            });
            var /** @type {?} */ preactivationDone$ = mergeMap.call(preactivationResolveData$, function (p) {
                return map.call(_this.hooks.afterPreactivation(p.snapshot), function () { return p; });
            });
            // create router state
            // this operation has side effects => route state is being affected
            var /** @type {?} */ routerState$ = map.call(preactivationDone$, function (_a) {
                var appliedUrl = _a.appliedUrl, snapshot = _a.snapshot, shouldActivate = _a.shouldActivate;
                if (shouldActivate) {
                    var /** @type {?} */ state = createRouterState(_this.routeReuseStrategy, snapshot, _this.routerState);
                    return { appliedUrl: appliedUrl, state: state, shouldActivate: shouldActivate };
                }
                else {
                    return { appliedUrl: appliedUrl, state: null, shouldActivate: shouldActivate };
                }
            });
            _this.activateRoutes(routerState$, _this.routerState, _this.currentUrlTree, id, url, rawUrl, skipLocationChange, replaceUrl, resolvePromise, rejectPromise);
        });
    };
    /* @internal */
    /**
     * @param {?} state
     * @param {?} storedState
     * @param {?} storedUrl
     * @param {?} id
     * @param {?} url
     * @param {?} rawUrl
     * @param {?} skipLocationChange
     * @param {?} replaceUrl
     * @param {?} resolvePromise
     * @param {?} rejectPromise
     * @return {?}
     */
    Router.prototype.activateRoutes = /**
     * @param {?} state
     * @param {?} storedState
     * @param {?} storedUrl
     * @param {?} id
     * @param {?} url
     * @param {?} rawUrl
     * @param {?} skipLocationChange
     * @param {?} replaceUrl
     * @param {?} resolvePromise
     * @param {?} rejectPromise
     * @return {?}
     */
    function (state, storedState, storedUrl, id, url, rawUrl, skipLocationChange, replaceUrl, resolvePromise, rejectPromise) {
        var _this = this;
        // applied the new router state
        // this operation has side effects
        var /** @type {?} */ navigationIsSuccessful;
        state
            .forEach(function (_a) {
            var appliedUrl = _a.appliedUrl, state = _a.state, shouldActivate = _a.shouldActivate;
            if (!shouldActivate || id !== _this.navigationId) {
                navigationIsSuccessful = false;
                return;
            }
            _this.currentUrlTree = appliedUrl;
            _this.rawUrlTree = _this.urlHandlingStrategy.merge(_this.currentUrlTree, rawUrl);
            (/** @type {?} */ (_this)).routerState = state;
            if (!skipLocationChange) {
                var /** @type {?} */ path = _this.urlSerializer.serialize(_this.rawUrlTree);
                if (_this.location.isCurrentPathEqualTo(path) || replaceUrl) {
                    _this.location.replaceState(path, '', { navigationId: id });
                }
                else {
                    _this.location.go(path, '', { navigationId: id });
                }
            }
            new ActivateRoutes(_this.routeReuseStrategy, state, storedState, function (evt) { return _this.triggerEvent(evt); })
                .activate(_this.rootContexts);
            navigationIsSuccessful = true;
        })
            .then(function () {
            if (navigationIsSuccessful) {
                _this.navigated = true;
                _this.lastSuccessfulId = id;
                (/** @type {?} */ (_this.events))
                    .next(new NavigationEnd(id, _this.serializeUrl(url), _this.serializeUrl(_this.currentUrlTree)));
                resolvePromise(true);
            }
            else {
                _this.resetUrlToCurrentUrlTree();
                (/** @type {?} */ (_this.events))
                    .next(new NavigationCancel(id, _this.serializeUrl(url), ''));
                resolvePromise(false);
            }
        }, function (e) {
            if (isNavigationCancelingError(e)) {
                _this.navigated = true;
                _this.resetStateAndUrl(storedState, storedUrl, rawUrl);
                (/** @type {?} */ (_this.events))
                    .next(new NavigationCancel(id, _this.serializeUrl(url), e.message));
                resolvePromise(false);
            }
            else {
                _this.resetStateAndUrl(storedState, storedUrl, rawUrl);
                (/** @type {?} */ (_this.events))
                    .next(new NavigationError(id, _this.serializeUrl(url), e));
                try {
                    resolvePromise(_this.errorHandler(e));
                }
                catch (/** @type {?} */ ee) {
                    rejectPromise(ee);
                }
            }
        });
    };
    /**
     * @param {?} storedState
     * @param {?} storedUrl
     * @param {?} rawUrl
     * @return {?}
     */
    Router.prototype.resetStateAndUrl = /**
     * @param {?} storedState
     * @param {?} storedUrl
     * @param {?} rawUrl
     * @return {?}
     */
    function (storedState, storedUrl, rawUrl) {
        (/** @type {?} */ (this)).routerState = storedState;
        this.currentUrlTree = storedUrl;
        this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, rawUrl);
        this.resetUrlToCurrentUrlTree();
    };
    /**
     * @return {?}
     */
    Router.prototype.resetUrlToCurrentUrlTree = /**
     * @return {?}
     */
    function () {
        this.location.replaceState(this.urlSerializer.serialize(this.rawUrlTree), '', { navigationId: this.lastSuccessfulId });
    };
    return Router;
}());
var ActivateRoutes = /** @class */ (function () {
    function ActivateRoutes(routeReuseStrategy, futureState, currState, forwardEvent) {
        this.routeReuseStrategy = routeReuseStrategy;
        this.futureState = futureState;
        this.currState = currState;
        this.forwardEvent = forwardEvent;
    }
    /**
     * @param {?} parentContexts
     * @return {?}
     */
    ActivateRoutes.prototype.activate = /**
     * @param {?} parentContexts
     * @return {?}
     */
    function (parentContexts) {
        var /** @type {?} */ futureRoot = this.futureState._root;
        var /** @type {?} */ currRoot = this.currState ? this.currState._root : null;
        this.deactivateChildRoutes(futureRoot, currRoot, parentContexts);
        advanceActivatedRoute(this.futureState.root);
        this.activateChildRoutes(futureRoot, currRoot, parentContexts);
    };
    /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} contexts
     * @return {?}
     */
    ActivateRoutes.prototype.deactivateChildRoutes = /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} contexts
     * @return {?}
     */
    function (futureNode, currNode, contexts) {
        var _this = this;
        var /** @type {?} */ children = nodeChildrenAsMap(currNode);
        // Recurse on the routes active in the future state to de-activate deeper children
        futureNode.children.forEach(function (futureChild) {
            var /** @type {?} */ childOutletName = futureChild.value.outlet;
            _this.deactivateRoutes(futureChild, children[childOutletName], contexts);
            delete children[childOutletName];
        });
        // De-activate the routes that will not be re-used
        forEach(children, function (v, childName) {
            _this.deactivateRouteAndItsChildren(v, contexts);
        });
    };
    /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} parentContext
     * @return {?}
     */
    ActivateRoutes.prototype.deactivateRoutes = /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} parentContext
     * @return {?}
     */
    function (futureNode, currNode, parentContext) {
        var /** @type {?} */ future = futureNode.value;
        var /** @type {?} */ curr = currNode ? currNode.value : null;
        if (future === curr) {
            // Reusing the node, check to see if the children need to be de-activated
            if (future.component) {
                // If we have a normal route, we need to go through an outlet.
                var /** @type {?} */ context = parentContext.getContext(future.outlet);
                if (context) {
                    this.deactivateChildRoutes(futureNode, currNode, context.children);
                }
            }
            else {
                // if we have a componentless route, we recurse but keep the same outlet map.
                this.deactivateChildRoutes(futureNode, currNode, parentContext);
            }
        }
        else {
            if (curr) {
                // Deactivate the current route which will not be re-used
                this.deactivateRouteAndItsChildren(currNode, parentContext);
            }
        }
    };
    /**
     * @param {?} route
     * @param {?} parentContexts
     * @return {?}
     */
    ActivateRoutes.prototype.deactivateRouteAndItsChildren = /**
     * @param {?} route
     * @param {?} parentContexts
     * @return {?}
     */
    function (route, parentContexts) {
        if (this.routeReuseStrategy.shouldDetach(route.value.snapshot)) {
            this.detachAndStoreRouteSubtree(route, parentContexts);
        }
        else {
            this.deactivateRouteAndOutlet(route, parentContexts);
        }
    };
    /**
     * @param {?} route
     * @param {?} parentContexts
     * @return {?}
     */
    ActivateRoutes.prototype.detachAndStoreRouteSubtree = /**
     * @param {?} route
     * @param {?} parentContexts
     * @return {?}
     */
    function (route, parentContexts) {
        var /** @type {?} */ context = parentContexts.getContext(route.value.outlet);
        if (context && context.outlet) {
            var /** @type {?} */ componentRef = context.outlet.detach();
            var /** @type {?} */ contexts = context.children.onOutletDeactivated();
            this.routeReuseStrategy.store(route.value.snapshot, { componentRef: componentRef, route: route, contexts: contexts });
        }
    };
    /**
     * @param {?} route
     * @param {?} parentContexts
     * @return {?}
     */
    ActivateRoutes.prototype.deactivateRouteAndOutlet = /**
     * @param {?} route
     * @param {?} parentContexts
     * @return {?}
     */
    function (route, parentContexts) {
        var _this = this;
        var /** @type {?} */ context = parentContexts.getContext(route.value.outlet);
        if (context) {
            var /** @type {?} */ children = nodeChildrenAsMap(route);
            var /** @type {?} */ contexts_1 = route.value.component ? context.children : parentContexts;
            forEach(children, function (v, k) { return _this.deactivateRouteAndItsChildren(v, contexts_1); });
            if (context.outlet) {
                // Destroy the component
                context.outlet.deactivate();
                // Destroy the contexts for all the outlets that were in the component
                context.children.onOutletDeactivated();
            }
        }
    };
    /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} contexts
     * @return {?}
     */
    ActivateRoutes.prototype.activateChildRoutes = /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} contexts
     * @return {?}
     */
    function (futureNode, currNode, contexts) {
        var _this = this;
        var /** @type {?} */ children = nodeChildrenAsMap(currNode);
        futureNode.children.forEach(function (c) {
            _this.activateRoutes(c, children[c.value.outlet], contexts);
            _this.forwardEvent(new ActivationEnd(c.value.snapshot));
        });
        if (futureNode.children.length) {
            this.forwardEvent(new ChildActivationEnd(futureNode.value.snapshot));
        }
    };
    /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} parentContexts
     * @return {?}
     */
    ActivateRoutes.prototype.activateRoutes = /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} parentContexts
     * @return {?}
     */
    function (futureNode, currNode, parentContexts) {
        var /** @type {?} */ future = futureNode.value;
        var /** @type {?} */ curr = currNode ? currNode.value : null;
        advanceActivatedRoute(future);
        // reusing the node
        if (future === curr) {
            if (future.component) {
                // If we have a normal route, we need to go through an outlet.
                var /** @type {?} */ context = parentContexts.getOrCreateContext(future.outlet);
                this.activateChildRoutes(futureNode, currNode, context.children);
            }
            else {
                // if we have a componentless route, we recurse but keep the same outlet map.
                this.activateChildRoutes(futureNode, currNode, parentContexts);
            }
        }
        else {
            if (future.component) {
                // if we have a normal route, we need to place the component into the outlet and recurse.
                var /** @type {?} */ context = parentContexts.getOrCreateContext(future.outlet);
                if (this.routeReuseStrategy.shouldAttach(future.snapshot)) {
                    var /** @type {?} */ stored = (/** @type {?} */ (this.routeReuseStrategy.retrieve(future.snapshot)));
                    this.routeReuseStrategy.store(future.snapshot, null);
                    context.children.onOutletReAttached(stored.contexts);
                    context.attachRef = stored.componentRef;
                    context.route = stored.route.value;
                    if (context.outlet) {
                        // Attach right away when the outlet has already been instantiated
                        // Otherwise attach from `RouterOutlet.ngOnInit` when it is instantiated
                        context.outlet.attach(stored.componentRef, stored.route.value);
                    }
                    advanceActivatedRouteNodeAndItsChildren(stored.route);
                }
                else {
                    var /** @type {?} */ config = parentLoadedConfig(future.snapshot);
                    var /** @type {?} */ cmpFactoryResolver = config ? config.module.componentFactoryResolver : null;
                    context.route = future;
                    context.resolver = cmpFactoryResolver;
                    if (context.outlet) {
                        // Activate the outlet when it has already been instantiated
                        // Otherwise it will get activated from its `ngOnInit` when instantiated
                        context.outlet.activateWith(future, cmpFactoryResolver);
                    }
                    this.activateChildRoutes(futureNode, null, context.children);
                }
            }
            else {
                // if we have a componentless route, we recurse but keep the same outlet map.
                this.activateChildRoutes(futureNode, null, parentContexts);
            }
        }
    };
    return ActivateRoutes;
}());
/**
 * @param {?} node
 * @return {?}
 */
function advanceActivatedRouteNodeAndItsChildren(node) {
    advanceActivatedRoute(node.value);
    node.children.forEach(advanceActivatedRouteNodeAndItsChildren);
}
/**
 * @param {?} snapshot
 * @return {?}
 */
function parentLoadedConfig(snapshot) {
    for (var /** @type {?} */ s = snapshot.parent; s; s = s.parent) {
        var /** @type {?} */ route = s.routeConfig;
        if (route && route._loadedConfig)
            return route._loadedConfig;
        if (route && route.component)
            return null;
    }
    return null;
}
/**
 * @param {?} commands
 * @return {?}
 */
function validateCommands(commands) {
    for (var /** @type {?} */ i = 0; i < commands.length; i++) {
        var /** @type {?} */ cmd = commands[i];
        if (cmd == null) {
            throw new Error("The requested path contains " + cmd + " segment at index " + i);
        }
    }
}

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
 * \@whatItDoes Lets you link to specific parts of your app.
 *
 * \@howToUse
 *
 * Consider the following route configuration:
 * `[{ path: 'user/:name', component: UserCmp }]`
 *
 * When linking to this `user/:name` route, you can write:
 * `<a routerLink='/user/bob'>link to user component</a>`
 *
 * \@description
 *
 * The RouterLink directives let you link to specific parts of your app.
 *
 * When the link is static, you can use the directive as follows:
 * `<a routerLink="/user/bob">link to user component</a>`
 *
 * If you use dynamic values to generate the link, you can pass an array of path
 * segments, followed by the params for each segment.
 *
 * For instance `['/team', teamId, 'user', userName, {details: true}]`
 * means that we want to generate a link to `/team/11/user/bob;details=true`.
 *
 * Multiple static segments can be merged into one
 * (e.g., `['/team/11/user', userName, {details: true}]`).
 *
 * The first segment name can be prepended with `/`, `./`, or `../`:
 * * If the first segment begins with `/`, the router will look up the route from the root of the
 *   app.
 * * If the first segment begins with `./`, or doesn't begin with a slash, the router will
 *   instead look in the children of the current activated route.
 * * And if the first segment begins with `../`, the router will go up one level.
 *
 * You can set query params and fragment as follows:
 *
 * ```
 * <a [routerLink]="['/user/bob']" [queryParams]="{debug: true}" fragment="education">
 *   link to user component
 * </a>
 * ```
 * RouterLink will use these to generate this link: `/user/bob#education?debug=true`.
 *
 * (Deprecated in v4.0.0 use `queryParamsHandling` instead) You can also tell the
 * directive to preserve the current query params and fragment:
 *
 * ```
 * <a [routerLink]="['/user/bob']" preserveQueryParams preserveFragment>
 *   link to user component
 * </a>
 * ```
 *
 * You can tell the directive to how to handle queryParams, available options are:
 *  - `'merge'`: merge the queryParams into the current queryParams
 *  - `'preserve'`: preserve the current queryParams
 *  - default/`''`: use the queryParams only
 *
 * Same options for {\@link NavigationExtras#queryParamsHandling
 * NavigationExtras#queryParamsHandling}.
 *
 * ```
 * <a [routerLink]="['/user/bob']" [queryParams]="{debug: true}" queryParamsHandling="merge">
 *   link to user component
 * </a>
 * ```
 *
 * The router link directive always treats the provided input as a delta to the current url.
 *
 * For instance, if the current url is `/user/(box//aux:team)`.
 *
 * Then the following link `<a [routerLink]="['/user/jim']">Jim</a>` will generate the link
 * `/user/(jim//aux:team)`.
 *
 * See {\@link Router#createUrlTree createUrlTree} for more information.
 *
 * \@ngModule RouterModule
 *
 * \@stable
 */
var RouterLink = /** @class */ (function () {
    function RouterLink(router, route, tabIndex, renderer, el) {
        this.router = router;
        this.route = route;
        this.commands = [];
        if (tabIndex == null) {
            renderer.setAttribute(el.nativeElement, 'tabindex', '0');
        }
    }
    Object.defineProperty(RouterLink.prototype, "routerLink", {
        set: /**
         * @param {?} commands
         * @return {?}
         */
        function (commands) {
            if (commands != null) {
                this.commands = Array.isArray(commands) ? commands : [commands];
            }
            else {
                this.commands = [];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouterLink.prototype, "preserveQueryParams", {
        set: /**
         * @deprecated 4.0.0 use `queryParamsHandling` instead.
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (isDevMode() && /** @type {?} */ (console) && /** @type {?} */ (console.warn)) {
                console.warn('preserveQueryParams is deprecated!, use queryParamsHandling instead.');
            }
            this.preserve = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    RouterLink.prototype.onClick = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ extras = {
            skipLocationChange: attrBoolValue(this.skipLocationChange),
            replaceUrl: attrBoolValue(this.replaceUrl),
        };
        this.router.navigateByUrl(this.urlTree, extras);
        return true;
    };
    Object.defineProperty(RouterLink.prototype, "urlTree", {
        get: /**
         * @return {?}
         */
        function () {
            return this.router.createUrlTree(this.commands, {
                relativeTo: this.route,
                queryParams: this.queryParams,
                fragment: this.fragment,
                preserveQueryParams: attrBoolValue(this.preserve),
                queryParamsHandling: this.queryParamsHandling,
                preserveFragment: attrBoolValue(this.preserveFragment),
            });
        },
        enumerable: true,
        configurable: true
    });
    RouterLink.decorators = [
        { type: Directive, args: [{ selector: ':not(a)[routerLink]' },] },
    ];
    /** @nocollapse */
    RouterLink.ctorParameters = function () { return [
        { type: Router, },
        { type: ActivatedRoute, },
        { type: undefined, decorators: [{ type: Attribute, args: ['tabindex',] },] },
        { type: Renderer2, },
        { type: ElementRef, },
    ]; };
    RouterLink.propDecorators = {
        "queryParams": [{ type: Input },],
        "fragment": [{ type: Input },],
        "queryParamsHandling": [{ type: Input },],
        "preserveFragment": [{ type: Input },],
        "skipLocationChange": [{ type: Input },],
        "replaceUrl": [{ type: Input },],
        "routerLink": [{ type: Input },],
        "preserveQueryParams": [{ type: Input },],
        "onClick": [{ type: HostListener, args: ['click',] },],
    };
    return RouterLink;
}());
/**
 * \@whatItDoes Lets you link to specific parts of your app.
 *
 * See {\@link RouterLink} for more information.
 *
 * \@ngModule RouterModule
 *
 * \@stable
 */
var RouterLinkWithHref = /** @class */ (function () {
    function RouterLinkWithHref(router, route, locationStrategy) {
        var _this = this;
        this.router = router;
        this.route = route;
        this.locationStrategy = locationStrategy;
        this.commands = [];
        this.subscription = router.events.subscribe(function (s) {
            if (s instanceof NavigationEnd) {
                _this.updateTargetUrlAndHref();
            }
        });
    }
    Object.defineProperty(RouterLinkWithHref.prototype, "routerLink", {
        set: /**
         * @param {?} commands
         * @return {?}
         */
        function (commands) {
            if (commands != null) {
                this.commands = Array.isArray(commands) ? commands : [commands];
            }
            else {
                this.commands = [];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouterLinkWithHref.prototype, "preserveQueryParams", {
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (isDevMode() && /** @type {?} */ (console) && /** @type {?} */ (console.warn)) {
                console.warn('preserveQueryParams is deprecated, use queryParamsHandling instead.');
            }
            this.preserve = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} changes
     * @return {?}
     */
    RouterLinkWithHref.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) { this.updateTargetUrlAndHref(); };
    /**
     * @return {?}
     */
    RouterLinkWithHref.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () { this.subscription.unsubscribe(); };
    /**
     * @param {?} button
     * @param {?} ctrlKey
     * @param {?} metaKey
     * @param {?} shiftKey
     * @return {?}
     */
    RouterLinkWithHref.prototype.onClick = /**
     * @param {?} button
     * @param {?} ctrlKey
     * @param {?} metaKey
     * @param {?} shiftKey
     * @return {?}
     */
    function (button, ctrlKey, metaKey, shiftKey) {
        if (button !== 0 || ctrlKey || metaKey || shiftKey) {
            return true;
        }
        if (typeof this.target === 'string' && this.target != '_self') {
            return true;
        }
        var /** @type {?} */ extras = {
            skipLocationChange: attrBoolValue(this.skipLocationChange),
            replaceUrl: attrBoolValue(this.replaceUrl),
        };
        this.router.navigateByUrl(this.urlTree, extras);
        return false;
    };
    /**
     * @return {?}
     */
    RouterLinkWithHref.prototype.updateTargetUrlAndHref = /**
     * @return {?}
     */
    function () {
        this.href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.urlTree));
    };
    Object.defineProperty(RouterLinkWithHref.prototype, "urlTree", {
        get: /**
         * @return {?}
         */
        function () {
            return this.router.createUrlTree(this.commands, {
                relativeTo: this.route,
                queryParams: this.queryParams,
                fragment: this.fragment,
                preserveQueryParams: attrBoolValue(this.preserve),
                queryParamsHandling: this.queryParamsHandling,
                preserveFragment: attrBoolValue(this.preserveFragment),
            });
        },
        enumerable: true,
        configurable: true
    });
    RouterLinkWithHref.decorators = [
        { type: Directive, args: [{ selector: 'a[routerLink]' },] },
    ];
    /** @nocollapse */
    RouterLinkWithHref.ctorParameters = function () { return [
        { type: Router, },
        { type: ActivatedRoute, },
        { type: LocationStrategy, },
    ]; };
    RouterLinkWithHref.propDecorators = {
        "target": [{ type: HostBinding, args: ['attr.target',] }, { type: Input },],
        "queryParams": [{ type: Input },],
        "fragment": [{ type: Input },],
        "queryParamsHandling": [{ type: Input },],
        "preserveFragment": [{ type: Input },],
        "skipLocationChange": [{ type: Input },],
        "replaceUrl": [{ type: Input },],
        "href": [{ type: HostBinding },],
        "routerLink": [{ type: Input },],
        "preserveQueryParams": [{ type: Input },],
        "onClick": [{ type: HostListener, args: ['click', ['$event.button', '$event.ctrlKey', '$event.metaKey', '$event.shiftKey'],] },],
    };
    return RouterLinkWithHref;
}());
/**
 * @param {?} s
 * @return {?}
 */
function attrBoolValue(s) {
    return s === '' || !!s;
}

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
 * \@whatItDoes Lets you add a CSS class to an element when the link's route becomes active.
 *
 * \@howToUse
 *
 * ```
 * <a routerLink="/user/bob" routerLinkActive="active-link">Bob</a>
 * ```
 *
 * \@description
 *
 * The RouterLinkActive directive lets you add a CSS class to an element when the link's route
 * becomes active.
 *
 * Consider the following example:
 *
 * ```
 * <a routerLink="/user/bob" routerLinkActive="active-link">Bob</a>
 * ```
 *
 * When the url is either '/user' or '/user/bob', the active-link class will
 * be added to the `a` tag. If the url changes, the class will be removed.
 *
 * You can set more than one class, as follows:
 *
 * ```
 * <a routerLink="/user/bob" routerLinkActive="class1 class2">Bob</a>
 * <a routerLink="/user/bob" [routerLinkActive]="['class1', 'class2']">Bob</a>
 * ```
 *
 * You can configure RouterLinkActive by passing `exact: true`. This will add the classes
 * only when the url matches the link exactly.
 *
 * ```
 * <a routerLink="/user/bob" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact:
 * true}">Bob</a>
 * ```
 *
 * You can assign the RouterLinkActive instance to a template variable and directly check
 * the `isActive` status.
 * ```
 * <a routerLink="/user/bob" routerLinkActive #rla="routerLinkActive">
 *   Bob {{ rla.isActive ? '(already open)' : ''}}
 * </a>
 * ```
 *
 * Finally, you can apply the RouterLinkActive directive to an ancestor of a RouterLink.
 *
 * ```
 * <div routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
 *   <a routerLink="/user/jim">Jim</a>
 *   <a routerLink="/user/bob">Bob</a>
 * </div>
 * ```
 *
 * This will set the active-link class on the div tag if the url is either '/user/jim' or
 * '/user/bob'.
 *
 * \@ngModule RouterModule
 *
 * \@stable
 */
var RouterLinkActive = /** @class */ (function () {
    function RouterLinkActive(router, element, renderer, cdr) {
        var _this = this;
        this.router = router;
        this.element = element;
        this.renderer = renderer;
        this.cdr = cdr;
        this.classes = [];
        this.isActive = false;
        this.routerLinkActiveOptions = { exact: false };
        this.subscription = router.events.subscribe(function (s) {
            if (s instanceof NavigationEnd) {
                _this.update();
            }
        });
    }
    /**
     * @return {?}
     */
    RouterLinkActive.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.links.changes.subscribe(function (_) { return _this.update(); });
        this.linksWithHrefs.changes.subscribe(function (_) { return _this.update(); });
        this.update();
    };
    Object.defineProperty(RouterLinkActive.prototype, "routerLinkActive", {
        set: /**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            var /** @type {?} */ classes = Array.isArray(data) ? data : data.split(' ');
            this.classes = classes.filter(function (c) { return !!c; });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} changes
     * @return {?}
     */
    RouterLinkActive.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) { this.update(); };
    /**
     * @return {?}
     */
    RouterLinkActive.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () { this.subscription.unsubscribe(); };
    /**
     * @return {?}
     */
    RouterLinkActive.prototype.update = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.links || !this.linksWithHrefs || !this.router.navigated)
            return;
        Promise.resolve().then(function () {
            var /** @type {?} */ hasActiveLinks = _this.hasActiveLinks();
            if (_this.isActive !== hasActiveLinks) {
                (/** @type {?} */ (_this)).isActive = hasActiveLinks;
                _this.classes.forEach(function (c) {
                    if (hasActiveLinks) {
                        _this.renderer.addClass(_this.element.nativeElement, c);
                    }
                    else {
                        _this.renderer.removeClass(_this.element.nativeElement, c);
                    }
                });
            }
        });
    };
    /**
     * @param {?} router
     * @return {?}
     */
    RouterLinkActive.prototype.isLinkActive = /**
     * @param {?} router
     * @return {?}
     */
    function (router) {
        var _this = this;
        return function (link) {
            return router.isActive(link.urlTree, _this.routerLinkActiveOptions.exact);
        };
    };
    /**
     * @return {?}
     */
    RouterLinkActive.prototype.hasActiveLinks = /**
     * @return {?}
     */
    function () {
        return this.links.some(this.isLinkActive(this.router)) ||
            this.linksWithHrefs.some(this.isLinkActive(this.router));
    };
    RouterLinkActive.decorators = [
        { type: Directive, args: [{
                    selector: '[routerLinkActive]',
                    exportAs: 'routerLinkActive',
                },] },
    ];
    /** @nocollapse */
    RouterLinkActive.ctorParameters = function () { return [
        { type: Router, },
        { type: ElementRef, },
        { type: Renderer2, },
        { type: ChangeDetectorRef, },
    ]; };
    RouterLinkActive.propDecorators = {
        "links": [{ type: ContentChildren, args: [RouterLink, { descendants: true },] },],
        "linksWithHrefs": [{ type: ContentChildren, args: [RouterLinkWithHref, { descendants: true },] },],
        "routerLinkActiveOptions": [{ type: Input },],
        "routerLinkActive": [{ type: Input },],
    };
    return RouterLinkActive;
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
 * Store contextual information about a {\@link RouterOutlet}
 *
 * \@stable
 */
var OutletContext = /** @class */ (function () {
    function OutletContext() {
        this.outlet = null;
        this.route = null;
        this.resolver = null;
        this.children = new ChildrenOutletContexts();
        this.attachRef = null;
    }
    return OutletContext;
}());
/**
 * Store contextual information about the children (= nested) {\@link RouterOutlet}
 *
 * \@stable
 */
var ChildrenOutletContexts = /** @class */ (function () {
    function ChildrenOutletContexts() {
        this.contexts = new Map();
    }
    /** Called when a `RouterOutlet` directive is instantiated */
    /**
     * Called when a `RouterOutlet` directive is instantiated
     * @param {?} childName
     * @param {?} outlet
     * @return {?}
     */
    ChildrenOutletContexts.prototype.onChildOutletCreated = /**
     * Called when a `RouterOutlet` directive is instantiated
     * @param {?} childName
     * @param {?} outlet
     * @return {?}
     */
    function (childName, outlet) {
        var /** @type {?} */ context = this.getOrCreateContext(childName);
        context.outlet = outlet;
        this.contexts.set(childName, context);
    };
    /**
     * Called when a `RouterOutlet` directive is destroyed.
     * We need to keep the context as the outlet could be destroyed inside a NgIf and might be
     * re-created later.
     */
    /**
     * Called when a `RouterOutlet` directive is destroyed.
     * We need to keep the context as the outlet could be destroyed inside a NgIf and might be
     * re-created later.
     * @param {?} childName
     * @return {?}
     */
    ChildrenOutletContexts.prototype.onChildOutletDestroyed = /**
     * Called when a `RouterOutlet` directive is destroyed.
     * We need to keep the context as the outlet could be destroyed inside a NgIf and might be
     * re-created later.
     * @param {?} childName
     * @return {?}
     */
    function (childName) {
        var /** @type {?} */ context = this.getContext(childName);
        if (context) {
            context.outlet = null;
        }
    };
    /**
     * Called when the corresponding route is deactivated during navigation.
     * Because the component get destroyed, all children outlet are destroyed.
     */
    /**
     * Called when the corresponding route is deactivated during navigation.
     * Because the component get destroyed, all children outlet are destroyed.
     * @return {?}
     */
    ChildrenOutletContexts.prototype.onOutletDeactivated = /**
     * Called when the corresponding route is deactivated during navigation.
     * Because the component get destroyed, all children outlet are destroyed.
     * @return {?}
     */
    function () {
        var /** @type {?} */ contexts = this.contexts;
        this.contexts = new Map();
        return contexts;
    };
    /**
     * @param {?} contexts
     * @return {?}
     */
    ChildrenOutletContexts.prototype.onOutletReAttached = /**
     * @param {?} contexts
     * @return {?}
     */
    function (contexts) { this.contexts = contexts; };
    /**
     * @param {?} childName
     * @return {?}
     */
    ChildrenOutletContexts.prototype.getOrCreateContext = /**
     * @param {?} childName
     * @return {?}
     */
    function (childName) {
        var /** @type {?} */ context = this.getContext(childName);
        if (!context) {
            context = new OutletContext();
            this.contexts.set(childName, context);
        }
        return context;
    };
    /**
     * @param {?} childName
     * @return {?}
     */
    ChildrenOutletContexts.prototype.getContext = /**
     * @param {?} childName
     * @return {?}
     */
    function (childName) { return this.contexts.get(childName) || null; };
    return ChildrenOutletContexts;
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
 * \@whatItDoes Acts as a placeholder that Angular dynamically fills based on the current router
 * state.
 *
 * \@howToUse
 *
 * ```
 * <router-outlet></router-outlet>
 * <router-outlet name='left'></router-outlet>
 * <router-outlet name='right'></router-outlet>
 * ```
 *
 * A router outlet will emit an activate event any time a new component is being instantiated,
 * and a deactivate event when it is being destroyed.
 *
 * ```
 * <router-outlet
 *   (activate)='onActivate($event)'
 *   (deactivate)='onDeactivate($event)'></router-outlet>
 * ```
 * \@ngModule RouterModule
 *
 * \@stable
 */
var RouterOutlet = /** @class */ (function () {
    function RouterOutlet(parentContexts, location, resolver, name, changeDetector) {
        this.parentContexts = parentContexts;
        this.location = location;
        this.resolver = resolver;
        this.changeDetector = changeDetector;
        this.activated = null;
        this._activatedRoute = null;
        this.activateEvents = new EventEmitter();
        this.deactivateEvents = new EventEmitter();
        this.name = name || PRIMARY_OUTLET;
        parentContexts.onChildOutletCreated(this.name, this);
    }
    /**
     * @return {?}
     */
    RouterOutlet.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () { this.parentContexts.onChildOutletDestroyed(this.name); };
    /**
     * @return {?}
     */
    RouterOutlet.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (!this.activated) {
            // If the outlet was not instantiated at the time the route got activated we need to populate
            // the outlet when it is initialized (ie inside a NgIf)
            var /** @type {?} */ context = this.parentContexts.getContext(this.name);
            if (context && context.route) {
                if (context.attachRef) {
                    // `attachRef` is populated when there is an existing component to mount
                    this.attach(context.attachRef, context.route);
                }
                else {
                    // otherwise the component defined in the configuration is created
                    this.activateWith(context.route, context.resolver || null);
                }
            }
        }
    };
    Object.defineProperty(RouterOutlet.prototype, "isActivated", {
        get: /**
         * @return {?}
         */
        function () { return !!this.activated; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouterOutlet.prototype, "component", {
        get: /**
         * @return {?}
         */
        function () {
            if (!this.activated)
                throw new Error('Outlet is not activated');
            return this.activated.instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouterOutlet.prototype, "activatedRoute", {
        get: /**
         * @return {?}
         */
        function () {
            if (!this.activated)
                throw new Error('Outlet is not activated');
            return /** @type {?} */ (this._activatedRoute);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouterOutlet.prototype, "activatedRouteData", {
        get: /**
         * @return {?}
         */
        function () {
            if (this._activatedRoute) {
                return this._activatedRoute.snapshot.data;
            }
            return {};
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Called when the `RouteReuseStrategy` instructs to detach the subtree
     */
    /**
     * Called when the `RouteReuseStrategy` instructs to detach the subtree
     * @return {?}
     */
    RouterOutlet.prototype.detach = /**
     * Called when the `RouteReuseStrategy` instructs to detach the subtree
     * @return {?}
     */
    function () {
        if (!this.activated)
            throw new Error('Outlet is not activated');
        this.location.detach();
        var /** @type {?} */ cmp = this.activated;
        this.activated = null;
        this._activatedRoute = null;
        return cmp;
    };
    /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     */
    /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     * @param {?} ref
     * @param {?} activatedRoute
     * @return {?}
     */
    RouterOutlet.prototype.attach = /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     * @param {?} ref
     * @param {?} activatedRoute
     * @return {?}
     */
    function (ref, activatedRoute) {
        this.activated = ref;
        this._activatedRoute = activatedRoute;
        this.location.insert(ref.hostView);
    };
    /**
     * @return {?}
     */
    RouterOutlet.prototype.deactivate = /**
     * @return {?}
     */
    function () {
        if (this.activated) {
            var /** @type {?} */ c = this.component;
            this.activated.destroy();
            this.activated = null;
            this._activatedRoute = null;
            this.deactivateEvents.emit(c);
        }
    };
    /**
     * @param {?} activatedRoute
     * @param {?} resolver
     * @return {?}
     */
    RouterOutlet.prototype.activateWith = /**
     * @param {?} activatedRoute
     * @param {?} resolver
     * @return {?}
     */
    function (activatedRoute, resolver) {
        if (this.isActivated) {
            throw new Error('Cannot activate an already activated outlet');
        }
        this._activatedRoute = activatedRoute;
        var /** @type {?} */ snapshot = activatedRoute._futureSnapshot;
        var /** @type {?} */ component = /** @type {?} */ (/** @type {?} */ ((snapshot.routeConfig)).component);
        resolver = resolver || this.resolver;
        var /** @type {?} */ factory = resolver.resolveComponentFactory(component);
        var /** @type {?} */ childContexts = this.parentContexts.getOrCreateContext(this.name).children;
        var /** @type {?} */ injector = new OutletInjector(activatedRoute, childContexts, this.location.injector);
        this.activated = this.location.createComponent(factory, this.location.length, injector);
        // Calling `markForCheck` to make sure we will run the change detection when the
        // `RouterOutlet` is inside a `ChangeDetectionStrategy.OnPush` component.
        this.changeDetector.markForCheck();
        this.activateEvents.emit(this.activated.instance);
    };
    RouterOutlet.decorators = [
        { type: Directive, args: [{ selector: 'router-outlet', exportAs: 'outlet' },] },
    ];
    /** @nocollapse */
    RouterOutlet.ctorParameters = function () { return [
        { type: ChildrenOutletContexts, },
        { type: ViewContainerRef, },
        { type: ComponentFactoryResolver, },
        { type: undefined, decorators: [{ type: Attribute, args: ['name',] },] },
        { type: ChangeDetectorRef, },
    ]; };
    RouterOutlet.propDecorators = {
        "activateEvents": [{ type: Output, args: ['activate',] },],
        "deactivateEvents": [{ type: Output, args: ['deactivate',] },],
    };
    return RouterOutlet;
}());
var OutletInjector = /** @class */ (function () {
    function OutletInjector(route, childContexts, parent) {
        this.route = route;
        this.childContexts = childContexts;
        this.parent = parent;
    }
    /**
     * @param {?} token
     * @param {?=} notFoundValue
     * @return {?}
     */
    OutletInjector.prototype.get = /**
     * @param {?} token
     * @param {?=} notFoundValue
     * @return {?}
     */
    function (token, notFoundValue) {
        if (token === ActivatedRoute) {
            return this.route;
        }
        if (token === ChildrenOutletContexts) {
            return this.childContexts;
        }
        return this.parent.get(token, notFoundValue);
    };
    return OutletInjector;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
*@license
*Copyright Google Inc. All Rights Reserved.
*
*Use of this source code is governed by an MIT-style license that can be
*found in the LICENSE file at https://angular.io/license
*/
/**
 * \@whatItDoes Provides a preloading strategy.
 *
 * \@experimental
 * @abstract
 */
var PreloadingStrategy = /** @class */ (function () {
    function PreloadingStrategy() {
    }
    return PreloadingStrategy;
}());
/**
 * \@whatItDoes Provides a preloading strategy that preloads all modules as quickly as possible.
 *
 * \@howToUse
 *
 * ```
 * RouteModule.forRoot(ROUTES, {preloadingStrategy: PreloadAllModules})
 * ```
 *
 * \@experimental
 */
var PreloadAllModules = /** @class */ (function () {
    function PreloadAllModules() {
    }
    /**
     * @param {?} route
     * @param {?} fn
     * @return {?}
     */
    PreloadAllModules.prototype.preload = /**
     * @param {?} route
     * @param {?} fn
     * @return {?}
     */
    function (route, fn) {
        return _catch.call(fn(), function () { return of(null); });
    };
    return PreloadAllModules;
}());
/**
 * \@whatItDoes Provides a preloading strategy that does not preload any modules.
 *
 * \@description
 *
 * This strategy is enabled by default.
 *
 * \@experimental
 */
var NoPreloading = /** @class */ (function () {
    function NoPreloading() {
    }
    /**
     * @param {?} route
     * @param {?} fn
     * @return {?}
     */
    NoPreloading.prototype.preload = /**
     * @param {?} route
     * @param {?} fn
     * @return {?}
     */
    function (route, fn) { return of(null); };
    return NoPreloading;
}());
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
 * \@stable
 */
var RouterPreloader = /** @class */ (function () {
    function RouterPreloader(router, moduleLoader, compiler, injector, preloadingStrategy) {
        this.router = router;
        this.injector = injector;
        this.preloadingStrategy = preloadingStrategy;
        var /** @type {?} */ onStartLoad = function (r) { return router.triggerEvent(new RouteConfigLoadStart(r)); };
        var /** @type {?} */ onEndLoad = function (r) { return router.triggerEvent(new RouteConfigLoadEnd(r)); };
        this.loader = new RouterConfigLoader(moduleLoader, compiler, onStartLoad, onEndLoad);
    }
    /**
     * @return {?}
     */
    RouterPreloader.prototype.setUpPreloading = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ navigations$ = filter.call(this.router.events, function (e) { return e instanceof NavigationEnd; });
        this.subscription = concatMap.call(navigations$, function () { return _this.preload(); }).subscribe(function () { });
    };
    /**
     * @return {?}
     */
    RouterPreloader.prototype.preload = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ ngModule = this.injector.get(NgModuleRef);
        return this.processRoutes(ngModule, this.router.config);
    };
    // TODO(jasonaden): This class relies on code external to the class to call setUpPreloading. If
    // this hasn't been done, ngOnDestroy will fail as this.subscription will be undefined. This
    // should be refactored.
    /**
     * @return {?}
     */
    RouterPreloader.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () { this.subscription.unsubscribe(); };
    /**
     * @param {?} ngModule
     * @param {?} routes
     * @return {?}
     */
    RouterPreloader.prototype.processRoutes = /**
     * @param {?} ngModule
     * @param {?} routes
     * @return {?}
     */
    function (ngModule, routes) {
        var /** @type {?} */ res = [];
        for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
            var route = routes_1[_i];
            // we already have the config loaded, just recurse
            if (route.loadChildren && !route.canLoad && route._loadedConfig) {
                var /** @type {?} */ childConfig = route._loadedConfig;
                res.push(this.processRoutes(childConfig.module, childConfig.routes));
                // no config loaded, fetch the config
            }
            else if (route.loadChildren && !route.canLoad) {
                res.push(this.preloadConfig(ngModule, route));
                // recurse into children
            }
            else if (route.children) {
                res.push(this.processRoutes(ngModule, route.children));
            }
        }
        return mergeAll.call(from(res));
    };
    /**
     * @param {?} ngModule
     * @param {?} route
     * @return {?}
     */
    RouterPreloader.prototype.preloadConfig = /**
     * @param {?} ngModule
     * @param {?} route
     * @return {?}
     */
    function (ngModule, route) {
        var _this = this;
        return this.preloadingStrategy.preload(route, function () {
            var /** @type {?} */ loaded$ = _this.loader.load(ngModule.injector, route);
            return mergeMap.call(loaded$, function (config) {
                route._loadedConfig = config;
                return _this.processRoutes(config.module, config.routes);
            });
        });
    };
    RouterPreloader.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    RouterPreloader.ctorParameters = function () { return [
        { type: Router, },
        { type: NgModuleFactoryLoader, },
        { type: Compiler, },
        { type: Injector, },
        { type: PreloadingStrategy, },
    ]; };
    return RouterPreloader;
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
 * \@whatItDoes Contains a list of directives
 * \@stable
 */
var ROUTER_DIRECTIVES = [RouterOutlet, RouterLink, RouterLinkWithHref, RouterLinkActive];
/**
 * \@whatItDoes Is used in DI to configure the router.
 * \@stable
 */
var ROUTER_CONFIGURATION = new InjectionToken('ROUTER_CONFIGURATION');
/**
 * \@docsNotRequired
 */
var ROUTER_FORROOT_GUARD = new InjectionToken('ROUTER_FORROOT_GUARD');
var ROUTER_PROVIDERS = [
    Location,
    { provide: UrlSerializer, useClass: DefaultUrlSerializer },
    {
        provide: Router,
        useFactory: setupRouter,
        deps: [
            ApplicationRef, UrlSerializer, ChildrenOutletContexts, Location, Injector,
            NgModuleFactoryLoader, Compiler, ROUTES, ROUTER_CONFIGURATION,
            [UrlHandlingStrategy, new Optional()], [RouteReuseStrategy, new Optional()]
        ]
    },
    ChildrenOutletContexts,
    { provide: ActivatedRoute, useFactory: rootRoute, deps: [Router] },
    { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
    RouterPreloader,
    NoPreloading,
    PreloadAllModules,
    { provide: ROUTER_CONFIGURATION, useValue: { enableTracing: false } },
];
/**
 * @return {?}
 */
function routerNgProbeToken() {
    return new NgProbeToken('Router', Router);
}
/**
 * \@whatItDoes Adds router directives and providers.
 *
 * \@howToUse
 *
 * RouterModule can be imported multiple times: once per lazily-loaded bundle.
 * Since the router deals with a global shared resource--location, we cannot have
 * more than one router service active.
 *
 * That is why there are two ways to create the module: `RouterModule.forRoot` and
 * `RouterModule.forChild`.
 *
 * * `forRoot` creates a module that contains all the directives, the given routes, and the router
 *   service itself.
 * * `forChild` creates a module that contains all the directives and the given routes, but does not
 *   include the router service.
 *
 * When registered at the root, the module should be used as follows
 *
 * ```
 * \@NgModule({
 *   imports: [RouterModule.forRoot(ROUTES)]
 * })
 * class MyNgModule {}
 * ```
 *
 * For submodules and lazy loaded submodules the module should be used as follows:
 *
 * ```
 * \@NgModule({
 *   imports: [RouterModule.forChild(ROUTES)]
 * })
 * class MyNgModule {}
 * ```
 *
 * \@description
 *
 * Managing state transitions is one of the hardest parts of building applications. This is
 * especially true on the web, where you also need to ensure that the state is reflected in the URL.
 * In addition, we often want to split applications into multiple bundles and load them on demand.
 * Doing this transparently is not trivial.
 *
 * The Angular router solves these problems. Using the router, you can declaratively specify
 * application states, manage state transitions while taking care of the URL, and load bundles on
 * demand.
 *
 * [Read this developer guide](https://angular.io/docs/ts/latest/guide/router.html) to get an
 * overview of how the router should be used.
 *
 * \@stable
 */
var RouterModule = /** @class */ (function () {
    // Note: We are injecting the Router so it gets created eagerly...
    function RouterModule(guard, router) {
    }
    /**
     * Creates a module with all the router providers and directives. It also optionally sets up an
     * application listener to perform an initial navigation.
     *
     * Options (see {@link ExtraOptions}):
     * * `enableTracing` makes the router log all its internal events to the console.
     * * `useHash` enables the location strategy that uses the URL fragment instead of the history
     * API.
     * * `initialNavigation` disables the initial navigation.
     * * `errorHandler` provides a custom error handler.
     * * `preloadingStrategy` configures a preloading strategy (see {@link PreloadAllModules}).
     * * `onSameUrlNavigation` configures how the router handles navigation to the current URL. See
     * {@link ExtraOptions} for more details.
     */
    /**
     * Creates a module with all the router providers and directives. It also optionally sets up an
     * application listener to perform an initial navigation.
     *
     * Options (see {\@link ExtraOptions}):
     * * `enableTracing` makes the router log all its internal events to the console.
     * * `useHash` enables the location strategy that uses the URL fragment instead of the history
     * API.
     * * `initialNavigation` disables the initial navigation.
     * * `errorHandler` provides a custom error handler.
     * * `preloadingStrategy` configures a preloading strategy (see {\@link PreloadAllModules}).
     * * `onSameUrlNavigation` configures how the router handles navigation to the current URL. See
     * {\@link ExtraOptions} for more details.
     * @param {?} routes
     * @param {?=} config
     * @return {?}
     */
    RouterModule.forRoot = /**
     * Creates a module with all the router providers and directives. It also optionally sets up an
     * application listener to perform an initial navigation.
     *
     * Options (see {\@link ExtraOptions}):
     * * `enableTracing` makes the router log all its internal events to the console.
     * * `useHash` enables the location strategy that uses the URL fragment instead of the history
     * API.
     * * `initialNavigation` disables the initial navigation.
     * * `errorHandler` provides a custom error handler.
     * * `preloadingStrategy` configures a preloading strategy (see {\@link PreloadAllModules}).
     * * `onSameUrlNavigation` configures how the router handles navigation to the current URL. See
     * {\@link ExtraOptions} for more details.
     * @param {?} routes
     * @param {?=} config
     * @return {?}
     */
    function (routes, config) {
        return {
            ngModule: RouterModule,
            providers: [
                ROUTER_PROVIDERS,
                provideRoutes(routes),
                {
                    provide: ROUTER_FORROOT_GUARD,
                    useFactory: provideForRootGuard,
                    deps: [[Router, new Optional(), new SkipSelf()]]
                },
                { provide: ROUTER_CONFIGURATION, useValue: config ? config : {} },
                {
                    provide: LocationStrategy,
                    useFactory: provideLocationStrategy,
                    deps: [
                        PlatformLocation, [new Inject(APP_BASE_HREF), new Optional()], ROUTER_CONFIGURATION
                    ]
                },
                {
                    provide: PreloadingStrategy,
                    useExisting: config && config.preloadingStrategy ? config.preloadingStrategy :
                        NoPreloading
                },
                { provide: NgProbeToken, multi: true, useFactory: routerNgProbeToken },
                provideRouterInitializer(),
            ],
        };
    };
    /**
     * Creates a module with all the router directives and a provider registering routes.
     */
    /**
     * Creates a module with all the router directives and a provider registering routes.
     * @param {?} routes
     * @return {?}
     */
    RouterModule.forChild = /**
     * Creates a module with all the router directives and a provider registering routes.
     * @param {?} routes
     * @return {?}
     */
    function (routes) {
        return { ngModule: RouterModule, providers: [provideRoutes(routes)] };
    };
    RouterModule.decorators = [
        { type: NgModule, args: [{ declarations: ROUTER_DIRECTIVES, exports: ROUTER_DIRECTIVES },] },
    ];
    /** @nocollapse */
    RouterModule.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ROUTER_FORROOT_GUARD,] },] },
        { type: Router, decorators: [{ type: Optional },] },
    ]; };
    return RouterModule;
}());
/**
 * @param {?} platformLocationStrategy
 * @param {?} baseHref
 * @param {?=} options
 * @return {?}
 */
function provideLocationStrategy(platformLocationStrategy, baseHref, options) {
    if (options === void 0) { options = {}; }
    return options.useHash ? new HashLocationStrategy(platformLocationStrategy, baseHref) :
        new PathLocationStrategy(platformLocationStrategy, baseHref);
}
/**
 * @param {?} router
 * @return {?}
 */
function provideForRootGuard(router) {
    if (router) {
        throw new Error("RouterModule.forRoot() called twice. Lazy loaded modules should use RouterModule.forChild() instead.");
    }
    return 'guarded';
}
/**
 * \@whatItDoes Registers routes.
 *
 * \@howToUse
 *
 * ```
 * \@NgModule({
 *   imports: [RouterModule.forChild(ROUTES)],
 *   providers: [provideRoutes(EXTRA_ROUTES)]
 * })
 * class MyNgModule {}
 * ```
 *
 * \@stable
 * @param {?} routes
 * @return {?}
 */
function provideRoutes(routes) {
    return [
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routes },
        { provide: ROUTES, multi: true, useValue: routes },
    ];
}
/**
 * \@whatItDoes Represents options to configure the router.
 *
 * \@stable
 * @record
 */

/**
 * @param {?} ref
 * @param {?} urlSerializer
 * @param {?} contexts
 * @param {?} location
 * @param {?} injector
 * @param {?} loader
 * @param {?} compiler
 * @param {?} config
 * @param {?=} opts
 * @param {?=} urlHandlingStrategy
 * @param {?=} routeReuseStrategy
 * @return {?}
 */
function setupRouter(ref, urlSerializer, contexts, location, injector, loader, compiler, config, opts, urlHandlingStrategy, routeReuseStrategy) {
    if (opts === void 0) { opts = {}; }
    var /** @type {?} */ router = new Router(null, urlSerializer, contexts, location, injector, loader, compiler, flatten(config));
    if (urlHandlingStrategy) {
        router.urlHandlingStrategy = urlHandlingStrategy;
    }
    if (routeReuseStrategy) {
        router.routeReuseStrategy = routeReuseStrategy;
    }
    if (opts.errorHandler) {
        router.errorHandler = opts.errorHandler;
    }
    if (opts.enableTracing) {
        var /** @type {?} */ dom_1 = ɵgetDOM();
        router.events.subscribe(function (e) {
            dom_1.logGroup("Router Event: " + ((/** @type {?} */ (e.constructor))).name);
            dom_1.log(e.toString());
            dom_1.log(e);
            dom_1.logGroupEnd();
        });
    }
    if (opts.onSameUrlNavigation) {
        router.onSameUrlNavigation = opts.onSameUrlNavigation;
    }
    if (opts.paramsInheritanceStrategy) {
        router.paramsInheritanceStrategy = opts.paramsInheritanceStrategy;
    }
    return router;
}
/**
 * @param {?} router
 * @return {?}
 */
function rootRoute(router) {
    return router.routerState.root;
}
/**
 * To initialize the router properly we need to do in two steps:
 *
 * We need to start the navigation in a APP_INITIALIZER to block the bootstrap if
 * a resolver or a guards executes asynchronously. Second, we need to actually run
 * activation in a BOOTSTRAP_LISTENER. We utilize the afterPreactivation
 * hook provided by the router to do that.
 *
 * The router navigation starts, reaches the point when preactivation is done, and then
 * pauses. It waits for the hook to be resolved. We then resolve it only in a bootstrap listener.
 */
var RouterInitializer = /** @class */ (function () {
    function RouterInitializer(injector) {
        this.injector = injector;
        this.initNavigation = false;
        this.resultOfPreactivationDone = new Subject();
    }
    /**
     * @return {?}
     */
    RouterInitializer.prototype.appInitializer = /**
     * @return {?}
     */
    function () {
        var _this = this;
        var /** @type {?} */ p = this.injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
        return p.then(function () {
            var /** @type {?} */ resolve = /** @type {?} */ ((null));
            var /** @type {?} */ res = new Promise(function (r) { return resolve = r; });
            var /** @type {?} */ router = _this.injector.get(Router);
            var /** @type {?} */ opts = _this.injector.get(ROUTER_CONFIGURATION);
            if (_this.isLegacyDisabled(opts) || _this.isLegacyEnabled(opts)) {
                resolve(true);
            }
            else if (opts.initialNavigation === 'disabled') {
                router.setUpLocationChangeListener();
                resolve(true);
            }
            else if (opts.initialNavigation === 'enabled') {
                router.hooks.afterPreactivation = function () {
                    // only the initial navigation should be delayed
                    if (!_this.initNavigation) {
                        _this.initNavigation = true;
                        resolve(true);
                        return _this.resultOfPreactivationDone;
                        // subsequent navigations should not be delayed
                    }
                    else {
                        return /** @type {?} */ (of(null));
                    }
                };
                router.initialNavigation();
            }
            else {
                throw new Error("Invalid initialNavigation options: '" + opts.initialNavigation + "'");
            }
            return res;
        });
    };
    /**
     * @param {?} bootstrappedComponentRef
     * @return {?}
     */
    RouterInitializer.prototype.bootstrapListener = /**
     * @param {?} bootstrappedComponentRef
     * @return {?}
     */
    function (bootstrappedComponentRef) {
        var /** @type {?} */ opts = this.injector.get(ROUTER_CONFIGURATION);
        var /** @type {?} */ preloader = this.injector.get(RouterPreloader);
        var /** @type {?} */ router = this.injector.get(Router);
        var /** @type {?} */ ref = this.injector.get(ApplicationRef);
        if (bootstrappedComponentRef !== ref.components[0]) {
            return;
        }
        if (this.isLegacyEnabled(opts)) {
            router.initialNavigation();
        }
        else if (this.isLegacyDisabled(opts)) {
            router.setUpLocationChangeListener();
        }
        preloader.setUpPreloading();
        router.resetRootComponentType(ref.componentTypes[0]);
        this.resultOfPreactivationDone.next(/** @type {?} */ ((null)));
        this.resultOfPreactivationDone.complete();
    };
    /**
     * @param {?} opts
     * @return {?}
     */
    RouterInitializer.prototype.isLegacyEnabled = /**
     * @param {?} opts
     * @return {?}
     */
    function (opts) {
        return opts.initialNavigation === 'legacy_enabled' || opts.initialNavigation === true ||
            opts.initialNavigation === undefined;
    };
    /**
     * @param {?} opts
     * @return {?}
     */
    RouterInitializer.prototype.isLegacyDisabled = /**
     * @param {?} opts
     * @return {?}
     */
    function (opts) {
        return opts.initialNavigation === 'legacy_disabled' || opts.initialNavigation === false;
    };
    RouterInitializer.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    RouterInitializer.ctorParameters = function () { return [
        { type: Injector, },
    ]; };
    return RouterInitializer;
}());
/**
 * @param {?} r
 * @return {?}
 */
function getAppInitializer(r) {
    return r.appInitializer.bind(r);
}
/**
 * @param {?} r
 * @return {?}
 */
function getBootstrapListener(r) {
    return r.bootstrapListener.bind(r);
}
/**
 * A token for the router initializer that will be called after the app is bootstrapped.
 *
 * \@experimental
 */
var ROUTER_INITIALIZER = new InjectionToken('Router Initializer');
/**
 * @return {?}
 */
function provideRouterInitializer() {
    return [
        RouterInitializer,
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: getAppInitializer,
            deps: [RouterInitializer]
        },
        { provide: ROUTER_INITIALIZER, useFactory: getBootstrapListener, deps: [RouterInitializer] },
        { provide: APP_BOOTSTRAP_LISTENER, multi: true, useExisting: ROUTER_INITIALIZER },
    ];
}

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
 * \@stable
 */
var VERSION = new Version('6.0.0-beta.2-8c5c0dac1');

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

export { RouterLink, RouterLinkWithHref, RouterLinkActive, RouterOutlet, ActivationEnd, ActivationStart, ChildActivationEnd, ChildActivationStart, GuardsCheckEnd, GuardsCheckStart, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, RouterEvent, RoutesRecognized, RouteReuseStrategy, Router, ROUTES, ROUTER_CONFIGURATION, ROUTER_INITIALIZER, RouterModule, provideRoutes, ChildrenOutletContexts, OutletContext, NoPreloading, PreloadAllModules, PreloadingStrategy, RouterPreloader, ActivatedRoute, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot, PRIMARY_OUTLET, convertToParamMap, UrlHandlingStrategy, DefaultUrlSerializer, UrlSegment, UrlSegmentGroup, UrlSerializer, UrlTree, VERSION, ROUTER_PROVIDERS as ɵROUTER_PROVIDERS, flatten as ɵflatten, ROUTER_FORROOT_GUARD as ɵa, RouterInitializer as ɵg, getAppInitializer as ɵh, getBootstrapListener as ɵi, provideForRootGuard as ɵd, provideLocationStrategy as ɵc, provideRouterInitializer as ɵj, rootRoute as ɵf, routerNgProbeToken as ɵb, setupRouter as ɵe, Tree as ɵk, TreeNode as ɵl };
//# sourceMappingURL=router.js.map

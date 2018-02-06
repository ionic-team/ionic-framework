/**
 * @license Angular v6.0.0-beta.2-8c5c0dac1
 * (c) 2010-2018 Google, Inc. https://angular.io/
 * License: MIT
 */
import { APP_BASE_HREF, HashLocationStrategy, LOCATION_INITIALIZED, Location, LocationStrategy, PathLocationStrategy, PlatformLocation } from '@angular/common';
import { ANALYZE_FOR_ENTRY_COMPONENTS, APP_BOOTSTRAP_LISTENER, APP_INITIALIZER, ApplicationRef, Attribute, ChangeDetectorRef, Compiler, ComponentFactoryResolver, ContentChildren, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Inject, Injectable, InjectionToken, Injector, Input, NgModule, NgModuleFactory, NgModuleFactoryLoader, NgModuleRef, NgProbeToken, Optional, Output, Renderer2, SkipSelf, SystemJsNgModuleLoader, Version, ViewContainerRef, isDevMode, ɵisObservable, ɵisPromise } from '@angular/core';
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
class RouterEvent {
    /**
     * @param {?} id
     * @param {?} url
     */
    constructor(id, url) {
        this.id = id;
        this.url = url;
    }
}
/**
 * \@whatItDoes Represents an event triggered when a navigation starts.
 *
 * \@stable
 */
class NavigationStart extends RouterEvent {
    /**
     * @param {?} id
     * @param {?} url
     * @param {?=} navigationTrigger
     * @param {?=} restoredState
     */
    constructor(/** @docsNotRequired */
        /** @docsNotRequired */
        id, /** @docsNotRequired */
        /** @docsNotRequired */
        url, /** @docsNotRequired */
        /** @docsNotRequired */
        navigationTrigger = 'imperative', /** @docsNotRequired */
        /** @docsNotRequired */
        restoredState = null) {
        super(id, url);
        this.navigationTrigger = navigationTrigger;
        this.restoredState = restoredState;
    }
    /**
     * \@docsNotRequired
     * @return {?}
     */
    toString() { return `NavigationStart(id: ${this.id}, url: '${this.url}')`; }
}
/**
 * \@whatItDoes Represents an event triggered when a navigation ends successfully.
 *
 * \@stable
 */
class NavigationEnd extends RouterEvent {
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} urlAfterRedirects
     */
    constructor(/** @docsNotRequired */
        /** @docsNotRequired */
        id, /** @docsNotRequired */
        /** @docsNotRequired */
        url, urlAfterRedirects) {
        super(id, url);
        this.urlAfterRedirects = urlAfterRedirects;
    }
    /**
     * \@docsNotRequired
     * @return {?}
     */
    toString() {
        return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
}
/**
 * \@whatItDoes Represents an event triggered when a navigation is canceled.
 *
 * \@stable
 */
class NavigationCancel extends RouterEvent {
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} reason
     */
    constructor(/** @docsNotRequired */
        /** @docsNotRequired */
        id, /** @docsNotRequired */
        /** @docsNotRequired */
        url, reason) {
        super(id, url);
        this.reason = reason;
    }
    /**
     * \@docsNotRequired
     * @return {?}
     */
    toString() { return `NavigationCancel(id: ${this.id}, url: '${this.url}')`; }
}
/**
 * \@whatItDoes Represents an event triggered when a navigation fails due to an unexpected error.
 *
 * \@stable
 */
class NavigationError extends RouterEvent {
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} error
     */
    constructor(/** @docsNotRequired */
        /** @docsNotRequired */
        id, /** @docsNotRequired */
        /** @docsNotRequired */
        url, error) {
        super(id, url);
        this.error = error;
    }
    /**
     * \@docsNotRequired
     * @return {?}
     */
    toString() {
        return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
}
/**
 * \@whatItDoes Represents an event triggered when routes are recognized.
 *
 * \@stable
 */
class RoutesRecognized extends RouterEvent {
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} urlAfterRedirects
     * @param {?} state
     */
    constructor(/** @docsNotRequired */
        /** @docsNotRequired */
        id, /** @docsNotRequired */
        /** @docsNotRequired */
        url, urlAfterRedirects, state) {
        super(id, url);
        this.urlAfterRedirects = urlAfterRedirects;
        this.state = state;
    }
    /**
     * \@docsNotRequired
     * @return {?}
     */
    toString() {
        return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
}
/**
 * \@whatItDoes Represents the start of the Guard phase of routing.
 *
 * \@experimental
 */
class GuardsCheckStart extends RouterEvent {
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} urlAfterRedirects
     * @param {?} state
     */
    constructor(/** @docsNotRequired */
        /** @docsNotRequired */
        id, /** @docsNotRequired */
        /** @docsNotRequired */
        url, urlAfterRedirects, state) {
        super(id, url);
        this.urlAfterRedirects = urlAfterRedirects;
        this.state = state;
    }
    /**
     * @return {?}
     */
    toString() {
        return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
}
/**
 * \@whatItDoes Represents the end of the Guard phase of routing.
 *
 * \@experimental
 */
class GuardsCheckEnd extends RouterEvent {
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} urlAfterRedirects
     * @param {?} state
     * @param {?} shouldActivate
     */
    constructor(/** @docsNotRequired */
        /** @docsNotRequired */
        id, /** @docsNotRequired */
        /** @docsNotRequired */
        url, urlAfterRedirects, state, shouldActivate) {
        super(id, url);
        this.urlAfterRedirects = urlAfterRedirects;
        this.state = state;
        this.shouldActivate = shouldActivate;
    }
    /**
     * @return {?}
     */
    toString() {
        return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
}
/**
 * \@whatItDoes Represents the start of the Resolve phase of routing. The timing of this
 * event may change, thus it's experimental. In the current iteration it will run
 * in the "resolve" phase whether there's things to resolve or not. In the future this
 * behavior may change to only run when there are things to be resolved.
 *
 * \@experimental
 */
class ResolveStart extends RouterEvent {
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} urlAfterRedirects
     * @param {?} state
     */
    constructor(/** @docsNotRequired */
        /** @docsNotRequired */
        id, /** @docsNotRequired */
        /** @docsNotRequired */
        url, urlAfterRedirects, state) {
        super(id, url);
        this.urlAfterRedirects = urlAfterRedirects;
        this.state = state;
    }
    /**
     * @return {?}
     */
    toString() {
        return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
}
/**
 * \@whatItDoes Represents the end of the Resolve phase of routing. See note on
 * {\@link ResolveStart} for use of this experimental API.
 *
 * \@experimental
 */
class ResolveEnd extends RouterEvent {
    /**
     * @param {?} id
     * @param {?} url
     * @param {?} urlAfterRedirects
     * @param {?} state
     */
    constructor(/** @docsNotRequired */
        /** @docsNotRequired */
        id, /** @docsNotRequired */
        /** @docsNotRequired */
        url, urlAfterRedirects, state) {
        super(id, url);
        this.urlAfterRedirects = urlAfterRedirects;
        this.state = state;
    }
    /**
     * @return {?}
     */
    toString() {
        return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
}
/**
 * \@whatItDoes Represents an event triggered before lazy loading a route config.
 *
 * \@experimental
 */
class RouteConfigLoadStart {
    /**
     * @param {?} route
     */
    constructor(route) {
        this.route = route;
    }
    /**
     * @return {?}
     */
    toString() { return `RouteConfigLoadStart(path: ${this.route.path})`; }
}
/**
 * \@whatItDoes Represents an event triggered when a route has been lazy loaded.
 *
 * \@experimental
 */
class RouteConfigLoadEnd {
    /**
     * @param {?} route
     */
    constructor(route) {
        this.route = route;
    }
    /**
     * @return {?}
     */
    toString() { return `RouteConfigLoadEnd(path: ${this.route.path})`; }
}
/**
 * \@whatItDoes Represents the start of end of the Resolve phase of routing. See note on
 * {\@link ChildActivationEnd} for use of this experimental API.
 *
 * \@experimental
 */
class ChildActivationStart {
    /**
     * @param {?} snapshot
     */
    constructor(snapshot) {
        this.snapshot = snapshot;
    }
    /**
     * @return {?}
     */
    toString() {
        const /** @type {?} */ path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || '';
        return `ChildActivationStart(path: '${path}')`;
    }
}
/**
 * \@whatItDoes Represents the start of end of the Resolve phase of routing. See note on
 * {\@link ChildActivationStart} for use of this experimental API.
 *
 * \@experimental
 */
class ChildActivationEnd {
    /**
     * @param {?} snapshot
     */
    constructor(snapshot) {
        this.snapshot = snapshot;
    }
    /**
     * @return {?}
     */
    toString() {
        const /** @type {?} */ path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || '';
        return `ChildActivationEnd(path: '${path}')`;
    }
}
/**
 * \@whatItDoes Represents the start of end of the Resolve phase of routing. See note on
 * {\@link ActivationEnd} for use of this experimental API.
 *
 * \@experimental
 */
class ActivationStart {
    /**
     * @param {?} snapshot
     */
    constructor(snapshot) {
        this.snapshot = snapshot;
    }
    /**
     * @return {?}
     */
    toString() {
        const /** @type {?} */ path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || '';
        return `ActivationStart(path: '${path}')`;
    }
}
/**
 * \@whatItDoes Represents the start of end of the Resolve phase of routing. See note on
 * {\@link ActivationStart} for use of this experimental API.
 *
 * \@experimental
 */
class ActivationEnd {
    /**
     * @param {?} snapshot
     */
    constructor(snapshot) {
        this.snapshot = snapshot;
    }
    /**
     * @return {?}
     */
    toString() {
        const /** @type {?} */ path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || '';
        return `ActivationEnd(path: '${path}')`;
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
 * \@whatItDoes Name of the primary outlet.
 *
 * \@stable
 */
const PRIMARY_OUTLET = 'primary';
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

class ParamsAsMap {
    /**
     * @param {?} params
     */
    constructor(params) { this.params = params || {}; }
    /**
     * @param {?} name
     * @return {?}
     */
    has(name) { return this.params.hasOwnProperty(name); }
    /**
     * @param {?} name
     * @return {?}
     */
    get(name) {
        if (this.has(name)) {
            const /** @type {?} */ v = this.params[name];
            return Array.isArray(v) ? v[0] : v;
        }
        return null;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    getAll(name) {
        if (this.has(name)) {
            const /** @type {?} */ v = this.params[name];
            return Array.isArray(v) ? v : [v];
        }
        return [];
    }
    /**
     * @return {?}
     */
    get keys() { return Object.keys(this.params); }
}
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
const NAVIGATION_CANCELING_ERROR = 'ngNavigationCancelingError';
/**
 * @param {?} message
 * @return {?}
 */
function navigationCancelingError(message) {
    const /** @type {?} */ error = Error('NavigationCancelingError: ' + message);
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
    const /** @type {?} */ parts = /** @type {?} */ ((route.path)).split('/');
    if (parts.length > segments.length) {
        // The actual URL is shorter than the config, no match
        return null;
    }
    if (route.pathMatch === 'full' &&
        (segmentGroup.hasChildren() || parts.length < segments.length)) {
        // The config is longer than the actual URL but we are looking for a full match, return null
        return null;
    }
    const /** @type {?} */ posParams = {};
    // Check each config part against the actual URL
    for (let /** @type {?} */ index = 0; index < parts.length; index++) {
        const /** @type {?} */ part = parts[index];
        const /** @type {?} */ segment = segments[index];
        const /** @type {?} */ isParameter = part.startsWith(':');
        if (isParameter) {
            posParams[part.substring(1)] = segment;
        }
        else if (part !== segment.path) {
            // The actual URL part does not match the config, no match
            return null;
        }
    }
    return { consumed: segments.slice(0, parts.length), posParams };
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

class LoadedRouterConfig {
    /**
     * @param {?} routes
     * @param {?} module
     */
    constructor(routes, module) {
        this.routes = routes;
        this.module = module;
    }
}
/**
 * @param {?} config
 * @param {?=} parentPath
 * @return {?}
 */
function validateConfig(config, parentPath = '') {
    // forEach doesn't iterate undefined values
    for (let /** @type {?} */ i = 0; i < config.length; i++) {
        const /** @type {?} */ route = config[i];
        const /** @type {?} */ fullPath = getFullPath(parentPath, route);
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
        throw new Error(`
      Invalid configuration of route '${fullPath}': Encountered undefined route.
      The reason might be an extra comma.

      Example:
      const routes: Routes = [
        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        { path: 'dashboard',  component: DashboardComponent },, << two commas
        { path: 'detail/:id', component: HeroDetailComponent }
      ];
    `);
    }
    if (Array.isArray(route)) {
        throw new Error(`Invalid configuration of route '${fullPath}': Array cannot be specified`);
    }
    if (!route.component && (route.outlet && route.outlet !== PRIMARY_OUTLET)) {
        throw new Error(`Invalid configuration of route '${fullPath}': a componentless route cannot have a named outlet set`);
    }
    if (route.redirectTo && route.children) {
        throw new Error(`Invalid configuration of route '${fullPath}': redirectTo and children cannot be used together`);
    }
    if (route.redirectTo && route.loadChildren) {
        throw new Error(`Invalid configuration of route '${fullPath}': redirectTo and loadChildren cannot be used together`);
    }
    if (route.children && route.loadChildren) {
        throw new Error(`Invalid configuration of route '${fullPath}': children and loadChildren cannot be used together`);
    }
    if (route.redirectTo && route.component) {
        throw new Error(`Invalid configuration of route '${fullPath}': redirectTo and component cannot be used together`);
    }
    if (route.path && route.matcher) {
        throw new Error(`Invalid configuration of route '${fullPath}': path and matcher cannot be used together`);
    }
    if (route.redirectTo === void 0 && !route.component && !route.children && !route.loadChildren) {
        throw new Error(`Invalid configuration of route '${fullPath}'. One of the following must be provided: component, redirectTo, children or loadChildren`);
    }
    if (route.path === void 0 && route.matcher === void 0) {
        throw new Error(`Invalid configuration of route '${fullPath}': routes must have either a path or a matcher specified`);
    }
    if (typeof route.path === 'string' && route.path.charAt(0) === '/') {
        throw new Error(`Invalid configuration of route '${fullPath}': path cannot start with a slash`);
    }
    if (route.path === '' && route.redirectTo !== void 0 && route.pathMatch === void 0) {
        const /** @type {?} */ exp = `The default value of 'pathMatch' is 'prefix', but often the intent is to use 'full'.`;
        throw new Error(`Invalid configuration of route '{path: "${fullPath}", redirectTo: "${route.redirectTo}"}': please provide 'pathMatch'. ${exp}`);
    }
    if (route.pathMatch !== void 0 && route.pathMatch !== 'full' && route.pathMatch !== 'prefix') {
        throw new Error(`Invalid configuration of route '${fullPath}': pathMatch can only be set to 'prefix' or 'full'`);
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
        return `${parentPath}/`;
    }
    else if (!parentPath && currentRoute.path) {
        return currentRoute.path;
    }
    else {
        return `${parentPath}/${currentRoute.path}`;
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
    for (let /** @type {?} */ i = 0; i < a.length; ++i) {
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
    const /** @type {?} */ k1 = Object.keys(a);
    const /** @type {?} */ k2 = Object.keys(b);
    if (k1.length != k2.length) {
        return false;
    }
    let /** @type {?} */ key;
    for (let /** @type {?} */ i = 0; i < k1.length; i++) {
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
    for (const /** @type {?} */ prop in map$$1) {
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
    const /** @type {?} */ waitHead = [];
    const /** @type {?} */ waitTail = [];
    const /** @type {?} */ res = {};
    forEach(obj, (a, k) => {
        const /** @type {?} */ mapped = map.call(fn(k, a), (r) => res[k] = r);
        if (k === PRIMARY_OUTLET) {
            waitHead.push(mapped);
        }
        else {
            waitTail.push(mapped);
        }
    });
    const /** @type {?} */ concat$ = concatAll.call(of(...waitHead, ...waitTail));
    const /** @type {?} */ last$ = last.call(concat$);
    return map.call(last$, () => res);
}
/**
 * ANDs Observables by merging all input observables, reducing to an Observable verifying all
 * input Observables return `true`.
 * @param {?} observables
 * @return {?}
 */
function andObservables(observables) {
    const /** @type {?} */ merged$ = mergeAll.call(observables);
    return every.call(merged$, (result) => result === true);
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
    for (const /** @type {?} */ c in containee.children) {
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
        Object.keys(containee).every(key => containee[key] === container[key]);
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
        const /** @type {?} */ current = container.segments.slice(0, containeePaths.length);
        if (!equalPath(current, containeePaths))
            return false;
        if (containee.hasChildren())
            return false;
        return true;
    }
    else if (container.segments.length === containeePaths.length) {
        if (!equalPath(container.segments, containeePaths))
            return false;
        for (const /** @type {?} */ c in containee.children) {
            if (!container.children[c])
                return false;
            if (!containsSegmentGroup(container.children[c], containee.children[c]))
                return false;
        }
        return true;
    }
    else {
        const /** @type {?} */ current = containeePaths.slice(0, container.segments.length);
        const /** @type {?} */ next = containeePaths.slice(container.segments.length);
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
class UrlTree {
    /**
     * \@internal
     * @param {?} root
     * @param {?} queryParams
     * @param {?} fragment
     */
    constructor(root, queryParams, fragment) {
        this.root = root;
        this.queryParams = queryParams;
        this.fragment = fragment;
    }
    /**
     * @return {?}
     */
    get queryParamMap() {
        if (!this._queryParamMap) {
            this._queryParamMap = convertToParamMap(this.queryParams);
        }
        return this._queryParamMap;
    }
    /**
     * \@docsNotRequired
     * @return {?}
     */
    toString() { return DEFAULT_SERIALIZER.serialize(this); }
}
/**
 * \@whatItDoes Represents the parsed URL segment group.
 *
 * See {\@link UrlTree} for more information.
 *
 * \@stable
 */
class UrlSegmentGroup {
    /**
     * @param {?} segments
     * @param {?} children
     */
    constructor(segments, children) {
        this.segments = segments;
        this.children = children;
        /**
         * The parent node in the url tree
         */
        this.parent = null;
        forEach(children, (v, k) => v.parent = this);
    }
    /**
     * Whether the segment has child segments
     * @return {?}
     */
    hasChildren() { return this.numberOfChildren > 0; }
    /**
     * Number of child segments
     * @return {?}
     */
    get numberOfChildren() { return Object.keys(this.children).length; }
    /**
     * \@docsNotRequired
     * @return {?}
     */
    toString() { return serializePaths(this); }
}
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
class UrlSegment {
    /**
     * @param {?} path
     * @param {?} parameters
     */
    constructor(path, parameters) {
        this.path = path;
        this.parameters = parameters;
    }
    /**
     * @return {?}
     */
    get parameterMap() {
        if (!this._parameterMap) {
            this._parameterMap = convertToParamMap(this.parameters);
        }
        return this._parameterMap;
    }
    /**
     * \@docsNotRequired
     * @return {?}
     */
    toString() { return serializePath(this); }
}
/**
 * @param {?} as
 * @param {?} bs
 * @return {?}
 */
function equalSegments(as, bs) {
    return equalPath(as, bs) && as.every((a, i) => shallowEqual(a.parameters, bs[i].parameters));
}
/**
 * @param {?} as
 * @param {?} bs
 * @return {?}
 */
function equalPath(as, bs) {
    if (as.length !== bs.length)
        return false;
    return as.every((a, i) => a.path === bs[i].path);
}
/**
 * @template T
 * @param {?} segment
 * @param {?} fn
 * @return {?}
 */
function mapChildrenIntoArray(segment, fn) {
    let /** @type {?} */ res = [];
    forEach(segment.children, (child, childOutlet) => {
        if (childOutlet === PRIMARY_OUTLET) {
            res = res.concat(fn(child, childOutlet));
        }
    });
    forEach(segment.children, (child, childOutlet) => {
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
class UrlSerializer {
}
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
class DefaultUrlSerializer {
    /**
     * Parses a url into a {\@link UrlTree}
     * @param {?} url
     * @return {?}
     */
    parse(url) {
        const /** @type {?} */ p = new UrlParser(url);
        return new UrlTree(p.parseRootSegment(), p.parseQueryParams(), p.parseFragment());
    }
    /**
     * Converts a {\@link UrlTree} into a url
     * @param {?} tree
     * @return {?}
     */
    serialize(tree) {
        const /** @type {?} */ segment = `/${serializeSegment(tree.root, true)}`;
        const /** @type {?} */ query = serializeQueryParams(tree.queryParams);
        const /** @type {?} */ fragment = typeof tree.fragment === `string` ? `#${encodeURI((/** @type {?} */ ((tree.fragment))))}` : '';
        return `${segment}${query}${fragment}`;
    }
}
const DEFAULT_SERIALIZER = new DefaultUrlSerializer();
/**
 * @param {?} segment
 * @return {?}
 */
function serializePaths(segment) {
    return segment.segments.map(p => serializePath(p)).join('/');
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
        const /** @type {?} */ primary = segment.children[PRIMARY_OUTLET] ?
            serializeSegment(segment.children[PRIMARY_OUTLET], false) :
            '';
        const /** @type {?} */ children = [];
        forEach(segment.children, (v, k) => {
            if (k !== PRIMARY_OUTLET) {
                children.push(`${k}:${serializeSegment(v, false)}`);
            }
        });
        return children.length > 0 ? `${primary}(${children.join('//')})` : primary;
    }
    else {
        const /** @type {?} */ children = mapChildrenIntoArray(segment, (v, k) => {
            if (k === PRIMARY_OUTLET) {
                return [serializeSegment(segment.children[PRIMARY_OUTLET], false)];
            }
            return [`${k}:${serializeSegment(v, false)}`];
        });
        return `${serializePaths(segment)}/(${children.join('//')})`;
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
    return `${encode(path.path)}${serializeParams(path.parameters)}`;
}
/**
 * @param {?} params
 * @return {?}
 */
function serializeParams(params) {
    return Object.keys(params).map(key => `;${encode(key)}=${encode(params[key])}`).join('');
}
/**
 * @param {?} params
 * @return {?}
 */
function serializeQueryParams(params) {
    const /** @type {?} */ strParams = Object.keys(params).map((name) => {
        const /** @type {?} */ value = params[name];
        return Array.isArray(value) ? value.map(v => `${encode(name)}=${encode(v)}`).join('&') :
            `${encode(name)}=${encode(value)}`;
    });
    return strParams.length ? `?${strParams.join("&")}` : '';
}
const SEGMENT_RE = /^[^\/()?;=&#]+/;
/**
 * @param {?} str
 * @return {?}
 */
function matchSegments(str) {
    const /** @type {?} */ match = str.match(SEGMENT_RE);
    return match ? match[0] : '';
}
const QUERY_PARAM_RE = /^[^=?&#]+/;
/**
 * @param {?} str
 * @return {?}
 */
function matchQueryParams(str) {
    const /** @type {?} */ match = str.match(QUERY_PARAM_RE);
    return match ? match[0] : '';
}
const QUERY_PARAM_VALUE_RE = /^[^?&#]+/;
/**
 * @param {?} str
 * @return {?}
 */
function matchUrlQueryParamValue(str) {
    const /** @type {?} */ match = str.match(QUERY_PARAM_VALUE_RE);
    return match ? match[0] : '';
}
class UrlParser {
    /**
     * @param {?} url
     */
    constructor(url) {
        this.url = url;
        this.remaining = url;
    }
    /**
     * @return {?}
     */
    parseRootSegment() {
        this.consumeOptional('/');
        if (this.remaining === '' || this.peekStartsWith('?') || this.peekStartsWith('#')) {
            return new UrlSegmentGroup([], {});
        }
        // The root segment group never has segments
        return new UrlSegmentGroup([], this.parseChildren());
    }
    /**
     * @return {?}
     */
    parseQueryParams() {
        const /** @type {?} */ params = {};
        if (this.consumeOptional('?')) {
            do {
                this.parseQueryParam(params);
            } while (this.consumeOptional('&'));
        }
        return params;
    }
    /**
     * @return {?}
     */
    parseFragment() {
        return this.consumeOptional('#') ? decodeURI(this.remaining) : null;
    }
    /**
     * @return {?}
     */
    parseChildren() {
        if (this.remaining === '') {
            return {};
        }
        this.consumeOptional('/');
        const /** @type {?} */ segments = [];
        if (!this.peekStartsWith('(')) {
            segments.push(this.parseSegment());
        }
        while (this.peekStartsWith('/') && !this.peekStartsWith('//') && !this.peekStartsWith('/(')) {
            this.capture('/');
            segments.push(this.parseSegment());
        }
        let /** @type {?} */ children = {};
        if (this.peekStartsWith('/(')) {
            this.capture('/');
            children = this.parseParens(true);
        }
        let /** @type {?} */ res = {};
        if (this.peekStartsWith('(')) {
            res = this.parseParens(false);
        }
        if (segments.length > 0 || Object.keys(children).length > 0) {
            res[PRIMARY_OUTLET] = new UrlSegmentGroup(segments, children);
        }
        return res;
    }
    /**
     * @return {?}
     */
    parseSegment() {
        const /** @type {?} */ path = matchSegments(this.remaining);
        if (path === '' && this.peekStartsWith(';')) {
            throw new Error(`Empty path url segment cannot have parameters: '${this.remaining}'.`);
        }
        this.capture(path);
        return new UrlSegment(decode(path), this.parseMatrixParams());
    }
    /**
     * @return {?}
     */
    parseMatrixParams() {
        const /** @type {?} */ params = {};
        while (this.consumeOptional(';')) {
            this.parseParam(params);
        }
        return params;
    }
    /**
     * @param {?} params
     * @return {?}
     */
    parseParam(params) {
        const /** @type {?} */ key = matchSegments(this.remaining);
        if (!key) {
            return;
        }
        this.capture(key);
        let /** @type {?} */ value = '';
        if (this.consumeOptional('=')) {
            const /** @type {?} */ valueMatch = matchSegments(this.remaining);
            if (valueMatch) {
                value = valueMatch;
                this.capture(value);
            }
        }
        params[decode(key)] = decode(value);
    }
    /**
     * @param {?} params
     * @return {?}
     */
    parseQueryParam(params) {
        const /** @type {?} */ key = matchQueryParams(this.remaining);
        if (!key) {
            return;
        }
        this.capture(key);
        let /** @type {?} */ value = '';
        if (this.consumeOptional('=')) {
            const /** @type {?} */ valueMatch = matchUrlQueryParamValue(this.remaining);
            if (valueMatch) {
                value = valueMatch;
                this.capture(value);
            }
        }
        const /** @type {?} */ decodedKey = decode(key);
        const /** @type {?} */ decodedVal = decode(value);
        if (params.hasOwnProperty(decodedKey)) {
            // Append to existing values
            let /** @type {?} */ currentVal = params[decodedKey];
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
    }
    /**
     * @param {?} allowPrimary
     * @return {?}
     */
    parseParens(allowPrimary) {
        const /** @type {?} */ segments = {};
        this.capture('(');
        while (!this.consumeOptional(')') && this.remaining.length > 0) {
            const /** @type {?} */ path = matchSegments(this.remaining);
            const /** @type {?} */ next = this.remaining[path.length];
            // if is is not one of these characters, then the segment was unescaped
            // or the group was not closed
            if (next !== '/' && next !== ')' && next !== ';') {
                throw new Error(`Cannot parse url '${this.url}'`);
            }
            let /** @type {?} */ outletName = /** @type {?} */ ((undefined));
            if (path.indexOf(':') > -1) {
                outletName = path.substr(0, path.indexOf(':'));
                this.capture(outletName);
                this.capture(':');
            }
            else if (allowPrimary) {
                outletName = PRIMARY_OUTLET;
            }
            const /** @type {?} */ children = this.parseChildren();
            segments[outletName] = Object.keys(children).length === 1 ? children[PRIMARY_OUTLET] :
                new UrlSegmentGroup([], children);
            this.consumeOptional('//');
        }
        return segments;
    }
    /**
     * @param {?} str
     * @return {?}
     */
    peekStartsWith(str) { return this.remaining.startsWith(str); }
    /**
     * @param {?} str
     * @return {?}
     */
    consumeOptional(str) {
        if (this.peekStartsWith(str)) {
            this.remaining = this.remaining.substring(str.length);
            return true;
        }
        return false;
    }
    /**
     * @param {?} str
     * @return {?}
     */
    capture(str) {
        if (!this.consumeOptional(str)) {
            throw new Error(`Expected "${str}".`);
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
class NoMatch {
    /**
     * @param {?=} segmentGroup
     */
    constructor(segmentGroup) { this.segmentGroup = segmentGroup || null; }
}
class AbsoluteRedirect {
    /**
     * @param {?} urlTree
     */
    constructor(urlTree) {
        this.urlTree = urlTree;
    }
}
/**
 * @param {?} segmentGroup
 * @return {?}
 */
function noMatch(segmentGroup) {
    return new Observable((obs) => obs.error(new NoMatch(segmentGroup)));
}
/**
 * @param {?} newTree
 * @return {?}
 */
function absoluteRedirect(newTree) {
    return new Observable((obs) => obs.error(new AbsoluteRedirect(newTree)));
}
/**
 * @param {?} redirectTo
 * @return {?}
 */
function namedOutletsRedirect(redirectTo) {
    return new Observable((obs) => obs.error(new Error(`Only absolute redirects can have named outlets. redirectTo: '${redirectTo}'`)));
}
/**
 * @param {?} route
 * @return {?}
 */
function canLoadFails(route) {
    return new Observable((obs) => obs.error(navigationCancelingError(`Cannot load children because the guard of the route "path: '${route.path}'" returned false`)));
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
class ApplyRedirects {
    /**
     * @param {?} moduleInjector
     * @param {?} configLoader
     * @param {?} urlSerializer
     * @param {?} urlTree
     * @param {?} config
     */
    constructor(moduleInjector, configLoader, urlSerializer, urlTree, config) {
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
    apply() {
        const /** @type {?} */ expanded$ = this.expandSegmentGroup(this.ngModule, this.config, this.urlTree.root, PRIMARY_OUTLET);
        const /** @type {?} */ urlTrees$ = map.call(expanded$, (rootSegmentGroup) => this.createUrlTree(rootSegmentGroup, this.urlTree.queryParams, /** @type {?} */ ((this.urlTree.fragment))));
        return _catch.call(urlTrees$, (e) => {
            if (e instanceof AbsoluteRedirect) {
                // after an absolute redirect we do not apply any more redirects!
                this.allowRedirects = false;
                // we need to run matching, so we can fetch all lazy-loaded modules
                return this.match(e.urlTree);
            }
            if (e instanceof NoMatch) {
                throw this.noMatchError(e);
            }
            throw e;
        });
    }
    /**
     * @param {?} tree
     * @return {?}
     */
    match(tree) {
        const /** @type {?} */ expanded$ = this.expandSegmentGroup(this.ngModule, this.config, tree.root, PRIMARY_OUTLET);
        const /** @type {?} */ mapped$ = map.call(expanded$, (rootSegmentGroup) => this.createUrlTree(rootSegmentGroup, tree.queryParams, /** @type {?} */ ((tree.fragment))));
        return _catch.call(mapped$, (e) => {
            if (e instanceof NoMatch) {
                throw this.noMatchError(e);
            }
            throw e;
        });
    }
    /**
     * @param {?} e
     * @return {?}
     */
    noMatchError(e) {
        return new Error(`Cannot match any routes. URL Segment: '${e.segmentGroup}'`);
    }
    /**
     * @param {?} rootCandidate
     * @param {?} queryParams
     * @param {?} fragment
     * @return {?}
     */
    createUrlTree(rootCandidate, queryParams, fragment) {
        const /** @type {?} */ root = rootCandidate.segments.length > 0 ?
            new UrlSegmentGroup([], { [PRIMARY_OUTLET]: rootCandidate }) :
            rootCandidate;
        return new UrlTree(root, queryParams, fragment);
    }
    /**
     * @param {?} ngModule
     * @param {?} routes
     * @param {?} segmentGroup
     * @param {?} outlet
     * @return {?}
     */
    expandSegmentGroup(ngModule, routes, segmentGroup, outlet) {
        if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
            return map.call(this.expandChildren(ngModule, routes, segmentGroup), (children) => new UrlSegmentGroup([], children));
        }
        return this.expandSegment(ngModule, segmentGroup, routes, segmentGroup.segments, outlet, true);
    }
    /**
     * @param {?} ngModule
     * @param {?} routes
     * @param {?} segmentGroup
     * @return {?}
     */
    expandChildren(ngModule, routes, segmentGroup) {
        return waitForMap(segmentGroup.children, (childOutlet, child) => this.expandSegmentGroup(ngModule, routes, child, childOutlet));
    }
    /**
     * @param {?} ngModule
     * @param {?} segmentGroup
     * @param {?} routes
     * @param {?} segments
     * @param {?} outlet
     * @param {?} allowRedirects
     * @return {?}
     */
    expandSegment(ngModule, segmentGroup, routes, segments, outlet, allowRedirects) {
        const /** @type {?} */ routes$ = of(...routes);
        const /** @type {?} */ processedRoutes$ = map.call(routes$, (r) => {
            const /** @type {?} */ expanded$ = this.expandSegmentAgainstRoute(ngModule, segmentGroup, routes, r, segments, outlet, allowRedirects);
            return _catch.call(expanded$, (e) => {
                if (e instanceof NoMatch) {
                    return of(null);
                }
                throw e;
            });
        });
        const /** @type {?} */ concattedProcessedRoutes$ = concatAll.call(processedRoutes$);
        const /** @type {?} */ first$ = first.call(concattedProcessedRoutes$, (s) => !!s);
        return _catch.call(first$, (e, _) => {
            if (e instanceof EmptyError || e.name === 'EmptyError') {
                if (this.noLeftoversInUrl(segmentGroup, segments, outlet)) {
                    return of(new UrlSegmentGroup([], {}));
                }
                throw new NoMatch(segmentGroup);
            }
            throw e;
        });
    }
    /**
     * @param {?} segmentGroup
     * @param {?} segments
     * @param {?} outlet
     * @return {?}
     */
    noLeftoversInUrl(segmentGroup, segments, outlet) {
        return segments.length === 0 && !segmentGroup.children[outlet];
    }
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
    expandSegmentAgainstRoute(ngModule, segmentGroup, routes, route, paths, outlet, allowRedirects) {
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
    }
    /**
     * @param {?} ngModule
     * @param {?} segmentGroup
     * @param {?} routes
     * @param {?} route
     * @param {?} segments
     * @param {?} outlet
     * @return {?}
     */
    expandSegmentAgainstRouteUsingRedirect(ngModule, segmentGroup, routes, route, segments, outlet) {
        if (route.path === '**') {
            return this.expandWildCardWithParamsAgainstRouteUsingRedirect(ngModule, routes, route, outlet);
        }
        return this.expandRegularSegmentAgainstRouteUsingRedirect(ngModule, segmentGroup, routes, route, segments, outlet);
    }
    /**
     * @param {?} ngModule
     * @param {?} routes
     * @param {?} route
     * @param {?} outlet
     * @return {?}
     */
    expandWildCardWithParamsAgainstRouteUsingRedirect(ngModule, routes, route, outlet) {
        const /** @type {?} */ newTree = this.applyRedirectCommands([], /** @type {?} */ ((route.redirectTo)), {});
        if (/** @type {?} */ ((route.redirectTo)).startsWith('/')) {
            return absoluteRedirect(newTree);
        }
        return mergeMap.call(this.lineralizeSegments(route, newTree), (newSegments) => {
            const /** @type {?} */ group = new UrlSegmentGroup(newSegments, {});
            return this.expandSegment(ngModule, group, routes, newSegments, outlet, false);
        });
    }
    /**
     * @param {?} ngModule
     * @param {?} segmentGroup
     * @param {?} routes
     * @param {?} route
     * @param {?} segments
     * @param {?} outlet
     * @return {?}
     */
    expandRegularSegmentAgainstRouteUsingRedirect(ngModule, segmentGroup, routes, route, segments, outlet) {
        const { matched, consumedSegments, lastChild, positionalParamSegments } = match(segmentGroup, route, segments);
        if (!matched)
            return noMatch(segmentGroup);
        const /** @type {?} */ newTree = this.applyRedirectCommands(consumedSegments, /** @type {?} */ ((route.redirectTo)), /** @type {?} */ (positionalParamSegments));
        if (/** @type {?} */ ((route.redirectTo)).startsWith('/')) {
            return absoluteRedirect(newTree);
        }
        return mergeMap.call(this.lineralizeSegments(route, newTree), (newSegments) => {
            return this.expandSegment(ngModule, segmentGroup, routes, newSegments.concat(segments.slice(lastChild)), outlet, false);
        });
    }
    /**
     * @param {?} ngModule
     * @param {?} rawSegmentGroup
     * @param {?} route
     * @param {?} segments
     * @return {?}
     */
    matchSegmentAgainstRoute(ngModule, rawSegmentGroup, route, segments) {
        if (route.path === '**') {
            if (route.loadChildren) {
                return map.call(this.configLoader.load(ngModule.injector, route), (cfg) => {
                    route._loadedConfig = cfg;
                    return new UrlSegmentGroup(segments, {});
                });
            }
            return of(new UrlSegmentGroup(segments, {}));
        }
        const { matched, consumedSegments, lastChild } = match(rawSegmentGroup, route, segments);
        if (!matched)
            return noMatch(rawSegmentGroup);
        const /** @type {?} */ rawSlicedSegments = segments.slice(lastChild);
        const /** @type {?} */ childConfig$ = this.getChildConfig(ngModule, route);
        return mergeMap.call(childConfig$, (routerConfig) => {
            const /** @type {?} */ childModule = routerConfig.module;
            const /** @type {?} */ childConfig = routerConfig.routes;
            const { segmentGroup, slicedSegments } = split(rawSegmentGroup, consumedSegments, rawSlicedSegments, childConfig);
            if (slicedSegments.length === 0 && segmentGroup.hasChildren()) {
                const /** @type {?} */ expanded$ = this.expandChildren(childModule, childConfig, segmentGroup);
                return map.call(expanded$, (children) => new UrlSegmentGroup(consumedSegments, children));
            }
            if (childConfig.length === 0 && slicedSegments.length === 0) {
                return of(new UrlSegmentGroup(consumedSegments, {}));
            }
            const /** @type {?} */ expanded$ = this.expandSegment(childModule, segmentGroup, childConfig, slicedSegments, PRIMARY_OUTLET, true);
            return map.call(expanded$, (cs) => new UrlSegmentGroup(consumedSegments.concat(cs.segments), cs.children));
        });
    }
    /**
     * @param {?} ngModule
     * @param {?} route
     * @return {?}
     */
    getChildConfig(ngModule, route) {
        if (route.children) {
            // The children belong to the same module
            return of(new LoadedRouterConfig(route.children, ngModule));
        }
        if (route.loadChildren) {
            // lazy children belong to the loaded module
            if (route._loadedConfig !== undefined) {
                return of(route._loadedConfig);
            }
            return mergeMap.call(runCanLoadGuard(ngModule.injector, route), (shouldLoad) => {
                if (shouldLoad) {
                    return map.call(this.configLoader.load(ngModule.injector, route), (cfg) => {
                        route._loadedConfig = cfg;
                        return cfg;
                    });
                }
                return canLoadFails(route);
            });
        }
        return of(new LoadedRouterConfig([], ngModule));
    }
    /**
     * @param {?} route
     * @param {?} urlTree
     * @return {?}
     */
    lineralizeSegments(route, urlTree) {
        let /** @type {?} */ res = [];
        let /** @type {?} */ c = urlTree.root;
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
    }
    /**
     * @param {?} segments
     * @param {?} redirectTo
     * @param {?} posParams
     * @return {?}
     */
    applyRedirectCommands(segments, redirectTo, posParams) {
        return this.applyRedirectCreatreUrlTree(redirectTo, this.urlSerializer.parse(redirectTo), segments, posParams);
    }
    /**
     * @param {?} redirectTo
     * @param {?} urlTree
     * @param {?} segments
     * @param {?} posParams
     * @return {?}
     */
    applyRedirectCreatreUrlTree(redirectTo, urlTree, segments, posParams) {
        const /** @type {?} */ newRoot = this.createSegmentGroup(redirectTo, urlTree.root, segments, posParams);
        return new UrlTree(newRoot, this.createQueryParams(urlTree.queryParams, this.urlTree.queryParams), urlTree.fragment);
    }
    /**
     * @param {?} redirectToParams
     * @param {?} actualParams
     * @return {?}
     */
    createQueryParams(redirectToParams, actualParams) {
        const /** @type {?} */ res = {};
        forEach(redirectToParams, (v, k) => {
            const /** @type {?} */ copySourceValue = typeof v === 'string' && v.startsWith(':');
            if (copySourceValue) {
                const /** @type {?} */ sourceName = v.substring(1);
                res[k] = actualParams[sourceName];
            }
            else {
                res[k] = v;
            }
        });
        return res;
    }
    /**
     * @param {?} redirectTo
     * @param {?} group
     * @param {?} segments
     * @param {?} posParams
     * @return {?}
     */
    createSegmentGroup(redirectTo, group, segments, posParams) {
        const /** @type {?} */ updatedSegments = this.createSegments(redirectTo, group.segments, segments, posParams);
        let /** @type {?} */ children = {};
        forEach(group.children, (child, name) => {
            children[name] = this.createSegmentGroup(redirectTo, child, segments, posParams);
        });
        return new UrlSegmentGroup(updatedSegments, children);
    }
    /**
     * @param {?} redirectTo
     * @param {?} redirectToSegments
     * @param {?} actualSegments
     * @param {?} posParams
     * @return {?}
     */
    createSegments(redirectTo, redirectToSegments, actualSegments, posParams) {
        return redirectToSegments.map(s => s.path.startsWith(':') ? this.findPosParam(redirectTo, s, posParams) :
            this.findOrReturn(s, actualSegments));
    }
    /**
     * @param {?} redirectTo
     * @param {?} redirectToUrlSegment
     * @param {?} posParams
     * @return {?}
     */
    findPosParam(redirectTo, redirectToUrlSegment, posParams) {
        const /** @type {?} */ pos = posParams[redirectToUrlSegment.path.substring(1)];
        if (!pos)
            throw new Error(`Cannot redirect to '${redirectTo}'. Cannot find '${redirectToUrlSegment.path}'.`);
        return pos;
    }
    /**
     * @param {?} redirectToUrlSegment
     * @param {?} actualSegments
     * @return {?}
     */
    findOrReturn(redirectToUrlSegment, actualSegments) {
        let /** @type {?} */ idx = 0;
        for (const /** @type {?} */ s of actualSegments) {
            if (s.path === redirectToUrlSegment.path) {
                actualSegments.splice(idx);
                return s;
            }
            idx++;
        }
        return redirectToUrlSegment;
    }
}
/**
 * @param {?} moduleInjector
 * @param {?} route
 * @return {?}
 */
function runCanLoadGuard(moduleInjector, route) {
    const /** @type {?} */ canLoad = route.canLoad;
    if (!canLoad || canLoad.length === 0)
        return of(true);
    const /** @type {?} */ obs = map.call(from(canLoad), (injectionToken) => {
        const /** @type {?} */ guard = moduleInjector.get(injectionToken);
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
    const /** @type {?} */ matcher = route.matcher || defaultUrlMatcher;
    const /** @type {?} */ res = matcher(segments, segmentGroup, route);
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
        const /** @type {?} */ s = new UrlSegmentGroup(consumedSegments, createChildrenForEmptySegments(config, new UrlSegmentGroup(slicedSegments, segmentGroup.children)));
        return { segmentGroup: mergeTrivialChildren(s), slicedSegments: [] };
    }
    if (slicedSegments.length === 0 &&
        containsEmptyPathRedirects(segmentGroup, slicedSegments, config)) {
        const /** @type {?} */ s = new UrlSegmentGroup(segmentGroup.segments, addEmptySegmentsToChildrenIfNeeded(segmentGroup, slicedSegments, config, segmentGroup.children));
        return { segmentGroup: mergeTrivialChildren(s), slicedSegments };
    }
    return { segmentGroup, slicedSegments };
}
/**
 * @param {?} s
 * @return {?}
 */
function mergeTrivialChildren(s) {
    if (s.numberOfChildren === 1 && s.children[PRIMARY_OUTLET]) {
        const /** @type {?} */ c = s.children[PRIMARY_OUTLET];
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
    const /** @type {?} */ res = {};
    for (const /** @type {?} */ r of routes) {
        if (isEmptyPathRedirect(segmentGroup, slicedSegments, r) && !children[getOutlet(r)]) {
            res[getOutlet(r)] = new UrlSegmentGroup([], {});
        }
    }
    return Object.assign({}, children, res);
}
/**
 * @param {?} routes
 * @param {?} primarySegmentGroup
 * @return {?}
 */
function createChildrenForEmptySegments(routes, primarySegmentGroup) {
    const /** @type {?} */ res = {};
    res[PRIMARY_OUTLET] = primarySegmentGroup;
    for (const /** @type {?} */ r of routes) {
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
    return routes.some(r => isEmptyPathRedirect(segmentGroup, segments, r) && getOutlet(r) !== PRIMARY_OUTLET);
}
/**
 * @param {?} segmentGroup
 * @param {?} segments
 * @param {?} routes
 * @return {?}
 */
function containsEmptyPathRedirects(segmentGroup, segments, routes) {
    return routes.some(r => isEmptyPathRedirect(segmentGroup, segments, r));
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
class Tree {
    /**
     * @param {?} root
     */
    constructor(root) { this._root = root; }
    /**
     * @return {?}
     */
    get root() { return this._root.value; }
    /**
     * \@internal
     * @param {?} t
     * @return {?}
     */
    parent(t) {
        const /** @type {?} */ p = this.pathFromRoot(t);
        return p.length > 1 ? p[p.length - 2] : null;
    }
    /**
     * \@internal
     * @param {?} t
     * @return {?}
     */
    children(t) {
        const /** @type {?} */ n = findNode(t, this._root);
        return n ? n.children.map(t => t.value) : [];
    }
    /**
     * \@internal
     * @param {?} t
     * @return {?}
     */
    firstChild(t) {
        const /** @type {?} */ n = findNode(t, this._root);
        return n && n.children.length > 0 ? n.children[0].value : null;
    }
    /**
     * \@internal
     * @param {?} t
     * @return {?}
     */
    siblings(t) {
        const /** @type {?} */ p = findPath(t, this._root);
        if (p.length < 2)
            return [];
        const /** @type {?} */ c = p[p.length - 2].children.map(c => c.value);
        return c.filter(cc => cc !== t);
    }
    /**
     * \@internal
     * @param {?} t
     * @return {?}
     */
    pathFromRoot(t) { return findPath(t, this._root).map(s => s.value); }
}
/**
 * @template T
 * @param {?} value
 * @param {?} node
 * @return {?}
 */
function findNode(value, node) {
    if (value === node.value)
        return node;
    for (const /** @type {?} */ child of node.children) {
        const /** @type {?} */ node = findNode(value, child);
        if (node)
            return node;
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
    for (const /** @type {?} */ child of node.children) {
        const /** @type {?} */ path = findPath(value, child);
        if (path.length) {
            path.unshift(node);
            return path;
        }
    }
    return [];
}
class TreeNode {
    /**
     * @param {?} value
     * @param {?} children
     */
    constructor(value, children) {
        this.value = value;
        this.children = children;
    }
    /**
     * @return {?}
     */
    toString() { return `TreeNode(${this.value})`; }
}
/**
 * @template T
 * @param {?} node
 * @return {?}
 */
function nodeChildrenAsMap(node) {
    const /** @type {?} */ map$$1 = {};
    if (node) {
        node.children.forEach(child => map$$1[child.value.outlet] = child);
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
class RouterState extends Tree {
    /**
     * \@internal
     * @param {?} root
     * @param {?} snapshot
     */
    constructor(root, snapshot) {
        super(root);
        this.snapshot = snapshot;
        setRouterState(/** @type {?} */ (this), root);
    }
    /**
     * @return {?}
     */
    toString() { return this.snapshot.toString(); }
}
/**
 * @param {?} urlTree
 * @param {?} rootComponent
 * @return {?}
 */
function createEmptyState(urlTree, rootComponent) {
    const /** @type {?} */ snapshot = createEmptyStateSnapshot(urlTree, rootComponent);
    const /** @type {?} */ emptyUrl = new BehaviorSubject([new UrlSegment('', {})]);
    const /** @type {?} */ emptyParams = new BehaviorSubject({});
    const /** @type {?} */ emptyData = new BehaviorSubject({});
    const /** @type {?} */ emptyQueryParams = new BehaviorSubject({});
    const /** @type {?} */ fragment = new BehaviorSubject('');
    const /** @type {?} */ activated = new ActivatedRoute(emptyUrl, emptyParams, emptyQueryParams, fragment, emptyData, PRIMARY_OUTLET, rootComponent, snapshot.root);
    activated.snapshot = snapshot.root;
    return new RouterState(new TreeNode(activated, []), snapshot);
}
/**
 * @param {?} urlTree
 * @param {?} rootComponent
 * @return {?}
 */
function createEmptyStateSnapshot(urlTree, rootComponent) {
    const /** @type {?} */ emptyParams = {};
    const /** @type {?} */ emptyData = {};
    const /** @type {?} */ emptyQueryParams = {};
    const /** @type {?} */ fragment = '';
    const /** @type {?} */ activated = new ActivatedRouteSnapshot([], emptyParams, emptyQueryParams, fragment, emptyData, PRIMARY_OUTLET, rootComponent, null, urlTree.root, -1, {});
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
class ActivatedRoute {
    /**
     * \@internal
     * @param {?} url
     * @param {?} params
     * @param {?} queryParams
     * @param {?} fragment
     * @param {?} data
     * @param {?} outlet
     * @param {?} component
     * @param {?} futureSnapshot
     */
    constructor(url, params, queryParams, fragment, data, outlet, component, futureSnapshot) {
        this.url = url;
        this.params = params;
        this.queryParams = queryParams;
        this.fragment = fragment;
        this.data = data;
        this.outlet = outlet;
        this.component = component;
        this._futureSnapshot = futureSnapshot;
    }
    /**
     * The configuration used to match this route
     * @return {?}
     */
    get routeConfig() { return this._futureSnapshot.routeConfig; }
    /**
     * The root of the router state
     * @return {?}
     */
    get root() { return this._routerState.root; }
    /**
     * The parent of this route in the router state tree
     * @return {?}
     */
    get parent() { return this._routerState.parent(this); }
    /**
     * The first child of this route in the router state tree
     * @return {?}
     */
    get firstChild() { return this._routerState.firstChild(this); }
    /**
     * The children of this route in the router state tree
     * @return {?}
     */
    get children() { return this._routerState.children(this); }
    /**
     * The path from the root of the router state tree to this route
     * @return {?}
     */
    get pathFromRoot() { return this._routerState.pathFromRoot(this); }
    /**
     * @return {?}
     */
    get paramMap() {
        if (!this._paramMap) {
            this._paramMap = map.call(this.params, (p) => convertToParamMap(p));
        }
        return this._paramMap;
    }
    /**
     * @return {?}
     */
    get queryParamMap() {
        if (!this._queryParamMap) {
            this._queryParamMap =
                map.call(this.queryParams, (p) => convertToParamMap(p));
        }
        return this._queryParamMap;
    }
    /**
     * @return {?}
     */
    toString() {
        return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
    }
}
/**
 * Returns the inherited params, data, and resolve for a given route.
 * By default, this only inherits values up to the nearest path-less or component-less route.
 * \@internal
 * @param {?} route
 * @param {?=} paramsInheritanceStrategy
 * @return {?}
 */
function inheritedParamsDataResolve(route, paramsInheritanceStrategy = 'emptyOnly') {
    const /** @type {?} */ pathFromRoot = route.pathFromRoot;
    let /** @type {?} */ inheritingStartingFrom = 0;
    if (paramsInheritanceStrategy !== 'always') {
        inheritingStartingFrom = pathFromRoot.length - 1;
        while (inheritingStartingFrom >= 1) {
            const /** @type {?} */ current = pathFromRoot[inheritingStartingFrom];
            const /** @type {?} */ parent = pathFromRoot[inheritingStartingFrom - 1];
            // current route is an empty path => inherits its parent's params and data
            if (current.routeConfig && current.routeConfig.path === '') {
                inheritingStartingFrom--;
                // parent is componentless => current route should inherit its params and data
            }
            else if (!parent.component) {
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
    return pathFromRoot.reduce((res, curr) => {
        const /** @type {?} */ params = Object.assign({}, res.params, curr.params);
        const /** @type {?} */ data = Object.assign({}, res.data, curr.data);
        const /** @type {?} */ resolve = Object.assign({}, res.resolve, curr._resolvedData);
        return { params, data, resolve };
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
class ActivatedRouteSnapshot {
    /**
     * \@internal
     * @param {?} url
     * @param {?} params
     * @param {?} queryParams
     * @param {?} fragment
     * @param {?} data
     * @param {?} outlet
     * @param {?} component
     * @param {?} routeConfig
     * @param {?} urlSegment
     * @param {?} lastPathIndex
     * @param {?} resolve
     */
    constructor(url, params, queryParams, fragment, data, outlet, component, routeConfig, urlSegment, lastPathIndex, resolve) {
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
    /**
     * The root of the router state
     * @return {?}
     */
    get root() { return this._routerState.root; }
    /**
     * The parent of this route in the router state tree
     * @return {?}
     */
    get parent() { return this._routerState.parent(this); }
    /**
     * The first child of this route in the router state tree
     * @return {?}
     */
    get firstChild() { return this._routerState.firstChild(this); }
    /**
     * The children of this route in the router state tree
     * @return {?}
     */
    get children() { return this._routerState.children(this); }
    /**
     * The path from the root of the router state tree to this route
     * @return {?}
     */
    get pathFromRoot() { return this._routerState.pathFromRoot(this); }
    /**
     * @return {?}
     */
    get paramMap() {
        if (!this._paramMap) {
            this._paramMap = convertToParamMap(this.params);
        }
        return this._paramMap;
    }
    /**
     * @return {?}
     */
    get queryParamMap() {
        if (!this._queryParamMap) {
            this._queryParamMap = convertToParamMap(this.queryParams);
        }
        return this._queryParamMap;
    }
    /**
     * @return {?}
     */
    toString() {
        const /** @type {?} */ url = this.url.map(segment => segment.toString()).join('/');
        const /** @type {?} */ matched = this.routeConfig ? this.routeConfig.path : '';
        return `Route(url:'${url}', path:'${matched}')`;
    }
}
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
class RouterStateSnapshot extends Tree {
    /**
     * \@internal
     * @param {?} url
     * @param {?} root
     */
    constructor(url, root) {
        super(root);
        this.url = url;
        setRouterState(/** @type {?} */ (this), root);
    }
    /**
     * @return {?}
     */
    toString() { return serializeNode(this._root); }
}
/**
 * @template U, T
 * @param {?} state
 * @param {?} node
 * @return {?}
 */
function setRouterState(state, node) {
    node.value._routerState = state;
    node.children.forEach(c => setRouterState(state, c));
}
/**
 * @param {?} node
 * @return {?}
 */
function serializeNode(node) {
    const /** @type {?} */ c = node.children.length > 0 ? ` { ${node.children.map(serializeNode).join(', ')} } ` : '';
    return `${node.value}${c}`;
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
        const /** @type {?} */ currentSnapshot = route.snapshot;
        const /** @type {?} */ nextSnapshot = route._futureSnapshot;
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
    const /** @type {?} */ equalUrlParams = shallowEqual(a.params, b.params) && equalSegments(a.url, b.url);
    const /** @type {?} */ parentsMismatch = !a.parent !== !b.parent;
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
    const /** @type {?} */ root = createNode(routeReuseStrategy, curr._root, prevState ? prevState._root : undefined);
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
        const /** @type {?} */ value = prevState.value;
        value._futureSnapshot = curr.value;
        const /** @type {?} */ children = createOrReuseChildren(routeReuseStrategy, curr, prevState);
        return new TreeNode(value, children);
        // retrieve an activated route that is used to be displayed, but is not currently displayed
    }
    else if (routeReuseStrategy.retrieve(curr.value)) {
        const /** @type {?} */ tree = (/** @type {?} */ (routeReuseStrategy.retrieve(curr.value))).route;
        setFutureSnapshotsOfActivatedRoutes(curr, tree);
        return tree;
    }
    else {
        const /** @type {?} */ value = createActivatedRoute(curr.value);
        const /** @type {?} */ children = curr.children.map(c => createNode(routeReuseStrategy, c));
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
    for (let /** @type {?} */ i = 0; i < curr.children.length; ++i) {
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
    return curr.children.map(child => {
        for (const /** @type {?} */ p of prevState.children) {
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
    const /** @type {?} */ nav = computeNavigation(commands);
    if (nav.toRoot()) {
        return tree(urlTree.root, new UrlSegmentGroup([], {}), urlTree, queryParams, fragment);
    }
    const /** @type {?} */ startingPosition = findStartingPosition(nav, urlTree, route);
    const /** @type {?} */ segmentGroup = startingPosition.processChildren ?
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
    let /** @type {?} */ qp = {};
    if (queryParams) {
        forEach(queryParams, (value, name) => {
            qp[name] = Array.isArray(value) ? value.map((v) => `${v}`) : `${value}`;
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
    const /** @type {?} */ children = {};
    forEach(current.children, (c, outletName) => {
        if (c === oldSegment) {
            children[outletName] = newSegment;
        }
        else {
            children[outletName] = replaceSegment(c, oldSegment, newSegment);
        }
    });
    return new UrlSegmentGroup(current.segments, children);
}
class Navigation {
    /**
     * @param {?} isAbsolute
     * @param {?} numberOfDoubleDots
     * @param {?} commands
     */
    constructor(isAbsolute, numberOfDoubleDots, commands) {
        this.isAbsolute = isAbsolute;
        this.numberOfDoubleDots = numberOfDoubleDots;
        this.commands = commands;
        if (isAbsolute && commands.length > 0 && isMatrixParams(commands[0])) {
            throw new Error('Root segment cannot have matrix parameters');
        }
        const /** @type {?} */ cmdWithOutlet = commands.find(c => typeof c === 'object' && c != null && c.outlets);
        if (cmdWithOutlet && cmdWithOutlet !== last$1(commands)) {
            throw new Error('{outlets:{}} has to be the last command');
        }
    }
    /**
     * @return {?}
     */
    toRoot() {
        return this.isAbsolute && this.commands.length === 1 && this.commands[0] == '/';
    }
}
/**
 * Transforms commands to a normalized `Navigation`
 * @param {?} commands
 * @return {?}
 */
function computeNavigation(commands) {
    if ((typeof commands[0] === 'string') && commands.length === 1 && commands[0] === '/') {
        return new Navigation(true, 0, commands);
    }
    let /** @type {?} */ numberOfDoubleDots = 0;
    let /** @type {?} */ isAbsolute = false;
    const /** @type {?} */ res = commands.reduce((res, cmd, cmdIdx) => {
        if (typeof cmd === 'object' && cmd != null) {
            if (cmd.outlets) {
                const /** @type {?} */ outlets = {};
                forEach(cmd.outlets, (commands, name) => {
                    outlets[name] = typeof commands === 'string' ? commands.split('/') : commands;
                });
                return [...res, { outlets }];
            }
            if (cmd.segmentPath) {
                return [...res, cmd.segmentPath];
            }
        }
        if (!(typeof cmd === 'string')) {
            return [...res, cmd];
        }
        if (cmdIdx === 0) {
            cmd.split('/').forEach((urlPart, partIndex) => {
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
        return [...res, cmd];
    }, []);
    return new Navigation(isAbsolute, numberOfDoubleDots, res);
}
class Position {
    /**
     * @param {?} segmentGroup
     * @param {?} processChildren
     * @param {?} index
     */
    constructor(segmentGroup, processChildren, index) {
        this.segmentGroup = segmentGroup;
        this.processChildren = processChildren;
        this.index = index;
    }
}
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
    const /** @type {?} */ modifier = isMatrixParams(nav.commands[0]) ? 0 : 1;
    const /** @type {?} */ index = route.snapshot._lastPathIndex + modifier;
    return createPositionApplyingDoubleDots(route.snapshot._urlSegment, index, nav.numberOfDoubleDots);
}
/**
 * @param {?} group
 * @param {?} index
 * @param {?} numberOfDoubleDots
 * @return {?}
 */
function createPositionApplyingDoubleDots(group, index, numberOfDoubleDots) {
    let /** @type {?} */ g = group;
    let /** @type {?} */ ci = index;
    let /** @type {?} */ dd = numberOfDoubleDots;
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
    return `${command}`;
}
/**
 * @param {?} commands
 * @return {?}
 */
function getOutlets(commands) {
    if (!(typeof commands[0] === 'object'))
        return { [PRIMARY_OUTLET]: commands };
    if (commands[0].outlets === undefined)
        return { [PRIMARY_OUTLET]: commands };
    return commands[0].outlets;
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
    const /** @type {?} */ m = prefixedWith(segmentGroup, startIndex, commands);
    const /** @type {?} */ slicedCommands = commands.slice(m.commandIndex);
    if (m.match && m.pathIndex < segmentGroup.segments.length) {
        const /** @type {?} */ g = new UrlSegmentGroup(segmentGroup.segments.slice(0, m.pathIndex), {});
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
        const /** @type {?} */ outlets = getOutlets(commands);
        const /** @type {?} */ children = {};
        forEach(outlets, (commands, outlet) => {
            if (commands !== null) {
                children[outlet] = updateSegmentGroup(segmentGroup.children[outlet], startIndex, commands);
            }
        });
        forEach(segmentGroup.children, (child, childOutlet) => {
            if (outlets[childOutlet] === undefined) {
                children[childOutlet] = child;
            }
        });
        return new UrlSegmentGroup(segmentGroup.segments, children);
    }
}
/**
 * @param {?} segmentGroup
 * @param {?} startIndex
 * @param {?} commands
 * @return {?}
 */
function prefixedWith(segmentGroup, startIndex, commands) {
    let /** @type {?} */ currentCommandIndex = 0;
    let /** @type {?} */ currentPathIndex = startIndex;
    const /** @type {?} */ noMatch = { match: false, pathIndex: 0, commandIndex: 0 };
    while (currentPathIndex < segmentGroup.segments.length) {
        if (currentCommandIndex >= commands.length)
            return noMatch;
        const /** @type {?} */ path = segmentGroup.segments[currentPathIndex];
        const /** @type {?} */ curr = getPath(commands[currentCommandIndex]);
        const /** @type {?} */ next = currentCommandIndex < commands.length - 1 ? commands[currentCommandIndex + 1] : null;
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
    const /** @type {?} */ paths = segmentGroup.segments.slice(0, startIndex);
    let /** @type {?} */ i = 0;
    while (i < commands.length) {
        if (typeof commands[i] === 'object' && commands[i].outlets !== undefined) {
            const /** @type {?} */ children = createNewSegmentChildren(commands[i].outlets);
            return new UrlSegmentGroup(paths, children);
        }
        // if we start with an object literal, we need to reuse the path part from the segment
        if (i === 0 && isMatrixParams(commands[0])) {
            const /** @type {?} */ p = segmentGroup.segments[startIndex];
            paths.push(new UrlSegment(p.path, commands[0]));
            i++;
            continue;
        }
        const /** @type {?} */ curr = getPath(commands[i]);
        const /** @type {?} */ next = (i < commands.length - 1) ? commands[i + 1] : null;
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
    const /** @type {?} */ children = {};
    forEach(outlets, (commands, outlet) => {
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
    const /** @type {?} */ res = {};
    forEach(params, (v, k) => res[k] = `${v}`);
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
class CanActivate {
    /**
     * @param {?} path
     */
    constructor(path) {
        this.path = path;
        this.route = this.path[this.path.length - 1];
    }
}
class CanDeactivate {
    /**
     * @param {?} component
     * @param {?} route
     */
    constructor(component, route) {
        this.component = component;
        this.route = route;
    }
}
/**
 * This class bundles the actions involved in preactivation of a route.
 */
class PreActivation {
    /**
     * @param {?} future
     * @param {?} curr
     * @param {?} moduleInjector
     * @param {?=} forwardEvent
     */
    constructor(future, curr, moduleInjector, forwardEvent) {
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
    initialize(parentContexts) {
        const /** @type {?} */ futureRoot = this.future._root;
        const /** @type {?} */ currRoot = this.curr ? this.curr._root : null;
        this.setupChildRouteGuards(futureRoot, currRoot, parentContexts, [futureRoot.value]);
    }
    /**
     * @return {?}
     */
    checkGuards() {
        if (!this.isDeactivating() && !this.isActivating()) {
            return of(true);
        }
        const /** @type {?} */ canDeactivate$ = this.runCanDeactivateChecks();
        return mergeMap.call(canDeactivate$, (canDeactivate) => canDeactivate ? this.runCanActivateChecks() : of(false));
    }
    /**
     * @param {?} paramsInheritanceStrategy
     * @return {?}
     */
    resolveData(paramsInheritanceStrategy) {
        if (!this.isActivating())
            return of(null);
        const /** @type {?} */ checks$ = from(this.canActivateChecks);
        const /** @type {?} */ runningChecks$ = concatMap.call(checks$, (check) => this.runResolve(check.route, paramsInheritanceStrategy));
        return reduce.call(runningChecks$, (_, __) => _);
    }
    /**
     * @return {?}
     */
    isDeactivating() { return this.canDeactivateChecks.length !== 0; }
    /**
     * @return {?}
     */
    isActivating() { return this.canActivateChecks.length !== 0; }
    /**
     * Iterates over child routes and calls recursive `setupRouteGuards` to get `this` instance in
     * proper state to run `checkGuards()` method.
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} contexts
     * @param {?} futurePath
     * @return {?}
     */
    setupChildRouteGuards(futureNode, currNode, contexts, futurePath) {
        const /** @type {?} */ prevChildren = nodeChildrenAsMap(currNode);
        // Process the children of the future route
        futureNode.children.forEach(c => {
            this.setupRouteGuards(c, prevChildren[c.value.outlet], contexts, futurePath.concat([c.value]));
            delete prevChildren[c.value.outlet];
        });
        // Process any children left from the current route (not active for the future route)
        forEach(prevChildren, (v, k) => this.deactivateRouteAndItsChildren(v, /** @type {?} */ ((contexts)).getContext(k)));
    }
    /**
     * Iterates over child routes and calls recursive `setupRouteGuards` to get `this` instance in
     * proper state to run `checkGuards()` method.
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} parentContexts
     * @param {?} futurePath
     * @return {?}
     */
    setupRouteGuards(futureNode, currNode, parentContexts, futurePath) {
        const /** @type {?} */ future = futureNode.value;
        const /** @type {?} */ curr = currNode ? currNode.value : null;
        const /** @type {?} */ context = parentContexts ? parentContexts.getContext(futureNode.value.outlet) : null;
        // reusing the node
        if (curr && future.routeConfig === curr.routeConfig) {
            const /** @type {?} */ shouldRunGuardsAndResolvers = this.shouldRunGuardsAndResolvers(curr, future, /** @type {?} */ ((future.routeConfig)).runGuardsAndResolvers);
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
                const /** @type {?} */ outlet = /** @type {?} */ ((/** @type {?} */ ((context)).outlet));
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
    }
    /**
     * @param {?} curr
     * @param {?} future
     * @param {?} mode
     * @return {?}
     */
    shouldRunGuardsAndResolvers(curr, future, mode) {
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
    }
    /**
     * @param {?} route
     * @param {?} context
     * @return {?}
     */
    deactivateRouteAndItsChildren(route, context) {
        const /** @type {?} */ children = nodeChildrenAsMap(route);
        const /** @type {?} */ r = route.value;
        forEach(children, (node, childName) => {
            if (!r.component) {
                this.deactivateRouteAndItsChildren(node, context);
            }
            else if (context) {
                this.deactivateRouteAndItsChildren(node, context.children.getContext(childName));
            }
            else {
                this.deactivateRouteAndItsChildren(node, null);
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
    }
    /**
     * @return {?}
     */
    runCanDeactivateChecks() {
        const /** @type {?} */ checks$ = from(this.canDeactivateChecks);
        const /** @type {?} */ runningChecks$ = mergeMap.call(checks$, (check) => this.runCanDeactivate(check.component, check.route));
        return every.call(runningChecks$, (result) => result === true);
    }
    /**
     * @return {?}
     */
    runCanActivateChecks() {
        const /** @type {?} */ checks$ = from(this.canActivateChecks);
        const /** @type {?} */ runningChecks$ = concatMap.call(checks$, (check) => andObservables(from([
            this.fireChildActivationStart(check.route.parent), this.fireActivationStart(check.route),
            this.runCanActivateChild(check.path), this.runCanActivate(check.route)
        ])));
        return every.call(runningChecks$, (result) => result === true);
        // this.fireChildActivationStart(check.path),
    }
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
    fireActivationStart(snapshot) {
        if (snapshot !== null && this.forwardEvent) {
            this.forwardEvent(new ActivationStart(snapshot));
        }
        return of(true);
    }
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
    fireChildActivationStart(snapshot) {
        if (snapshot !== null && this.forwardEvent) {
            this.forwardEvent(new ChildActivationStart(snapshot));
        }
        return of(true);
    }
    /**
     * @param {?} future
     * @return {?}
     */
    runCanActivate(future) {
        const /** @type {?} */ canActivate = future.routeConfig ? future.routeConfig.canActivate : null;
        if (!canActivate || canActivate.length === 0)
            return of(true);
        const /** @type {?} */ obs = map.call(from(canActivate), (c) => {
            const /** @type {?} */ guard = this.getToken(c, future);
            let /** @type {?} */ observable;
            if (guard.canActivate) {
                observable = wrapIntoObservable(guard.canActivate(future, this.future));
            }
            else {
                observable = wrapIntoObservable(guard(future, this.future));
            }
            return first.call(observable);
        });
        return andObservables(obs);
    }
    /**
     * @param {?} path
     * @return {?}
     */
    runCanActivateChild(path) {
        const /** @type {?} */ future = path[path.length - 1];
        const /** @type {?} */ canActivateChildGuards = path.slice(0, path.length - 1)
            .reverse()
            .map(p => this.extractCanActivateChild(p))
            .filter(_ => _ !== null);
        return andObservables(map.call(from(canActivateChildGuards), (d) => {
            const /** @type {?} */ obs = map.call(from(d.guards), (c) => {
                const /** @type {?} */ guard = this.getToken(c, d.node);
                let /** @type {?} */ observable;
                if (guard.canActivateChild) {
                    observable = wrapIntoObservable(guard.canActivateChild(future, this.future));
                }
                else {
                    observable = wrapIntoObservable(guard(future, this.future));
                }
                return first.call(observable);
            });
            return andObservables(obs);
        }));
    }
    /**
     * @param {?} p
     * @return {?}
     */
    extractCanActivateChild(p) {
        const /** @type {?} */ canActivateChild = p.routeConfig ? p.routeConfig.canActivateChild : null;
        if (!canActivateChild || canActivateChild.length === 0)
            return null;
        return { node: p, guards: canActivateChild };
    }
    /**
     * @param {?} component
     * @param {?} curr
     * @return {?}
     */
    runCanDeactivate(component, curr) {
        const /** @type {?} */ canDeactivate = curr && curr.routeConfig ? curr.routeConfig.canDeactivate : null;
        if (!canDeactivate || canDeactivate.length === 0)
            return of(true);
        const /** @type {?} */ canDeactivate$ = mergeMap.call(from(canDeactivate), (c) => {
            const /** @type {?} */ guard = this.getToken(c, curr);
            let /** @type {?} */ observable;
            if (guard.canDeactivate) {
                observable =
                    wrapIntoObservable(guard.canDeactivate(component, curr, this.curr, this.future));
            }
            else {
                observable = wrapIntoObservable(guard(component, curr, this.curr, this.future));
            }
            return first.call(observable);
        });
        return every.call(canDeactivate$, (result) => result === true);
    }
    /**
     * @param {?} future
     * @param {?} paramsInheritanceStrategy
     * @return {?}
     */
    runResolve(future, paramsInheritanceStrategy) {
        const /** @type {?} */ resolve = future._resolve;
        return map.call(this.resolveNode(resolve, future), (resolvedData) => {
            future._resolvedData = resolvedData;
            future.data = Object.assign({}, future.data, inheritedParamsDataResolve(future, paramsInheritanceStrategy).resolve);
            return null;
        });
    }
    /**
     * @param {?} resolve
     * @param {?} future
     * @return {?}
     */
    resolveNode(resolve, future) {
        const /** @type {?} */ keys = Object.keys(resolve);
        if (keys.length === 0) {
            return of({});
        }
        if (keys.length === 1) {
            const /** @type {?} */ key = keys[0];
            return map.call(this.getResolver(resolve[key], future), (value) => { return { [key]: value }; });
        }
        const /** @type {?} */ data = {};
        const /** @type {?} */ runningResolvers$ = mergeMap.call(from(keys), (key) => {
            return map.call(this.getResolver(resolve[key], future), (value) => {
                data[key] = value;
                return value;
            });
        });
        return map.call(last.call(runningResolvers$), () => data);
    }
    /**
     * @param {?} injectionToken
     * @param {?} future
     * @return {?}
     */
    getResolver(injectionToken, future) {
        const /** @type {?} */ resolver = this.getToken(injectionToken, future);
        return resolver.resolve ? wrapIntoObservable(resolver.resolve(future, this.future)) :
            wrapIntoObservable(resolver(future, this.future));
    }
    /**
     * @param {?} token
     * @param {?} snapshot
     * @return {?}
     */
    getToken(token, snapshot) {
        const /** @type {?} */ config = closestLoadedConfig(snapshot);
        const /** @type {?} */ injector = config ? config.module.injector : this.moduleInjector;
        return injector.get(token);
    }
}
/**
 * @param {?} snapshot
 * @return {?}
 */
function closestLoadedConfig(snapshot) {
    if (!snapshot)
        return null;
    for (let /** @type {?} */ s = snapshot.parent; s; s = s.parent) {
        const /** @type {?} */ route = s.routeConfig;
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
class NoMatch$1 {
}
/**
 * @param {?} rootComponentType
 * @param {?} config
 * @param {?} urlTree
 * @param {?} url
 * @param {?=} paramsInheritanceStrategy
 * @return {?}
 */
function recognize(rootComponentType, config, urlTree, url, paramsInheritanceStrategy = 'emptyOnly') {
    return new Recognizer(rootComponentType, config, urlTree, url, paramsInheritanceStrategy)
        .recognize();
}
class Recognizer {
    /**
     * @param {?} rootComponentType
     * @param {?} config
     * @param {?} urlTree
     * @param {?} url
     * @param {?} paramsInheritanceStrategy
     */
    constructor(rootComponentType, config, urlTree, url, paramsInheritanceStrategy) {
        this.rootComponentType = rootComponentType;
        this.config = config;
        this.urlTree = urlTree;
        this.url = url;
        this.paramsInheritanceStrategy = paramsInheritanceStrategy;
    }
    /**
     * @return {?}
     */
    recognize() {
        try {
            const /** @type {?} */ rootSegmentGroup = split$1(this.urlTree.root, [], [], this.config).segmentGroup;
            const /** @type {?} */ children = this.processSegmentGroup(this.config, rootSegmentGroup, PRIMARY_OUTLET);
            const /** @type {?} */ root = new ActivatedRouteSnapshot([], Object.freeze({}), Object.freeze(this.urlTree.queryParams), /** @type {?} */ ((this.urlTree.fragment)), {}, PRIMARY_OUTLET, this.rootComponentType, null, this.urlTree.root, -1, {});
            const /** @type {?} */ rootNode = new TreeNode(root, children);
            const /** @type {?} */ routeState = new RouterStateSnapshot(this.url, rootNode);
            this.inheritParamsAndData(routeState._root);
            return of(routeState);
        }
        catch (/** @type {?} */ e) {
            return new Observable((obs) => obs.error(e));
        }
    }
    /**
     * @param {?} routeNode
     * @return {?}
     */
    inheritParamsAndData(routeNode) {
        const /** @type {?} */ route = routeNode.value;
        const /** @type {?} */ i = inheritedParamsDataResolve(route, this.paramsInheritanceStrategy);
        route.params = Object.freeze(i.params);
        route.data = Object.freeze(i.data);
        routeNode.children.forEach(n => this.inheritParamsAndData(n));
    }
    /**
     * @param {?} config
     * @param {?} segmentGroup
     * @param {?} outlet
     * @return {?}
     */
    processSegmentGroup(config, segmentGroup, outlet) {
        if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
            return this.processChildren(config, segmentGroup);
        }
        return this.processSegment(config, segmentGroup, segmentGroup.segments, outlet);
    }
    /**
     * @param {?} config
     * @param {?} segmentGroup
     * @return {?}
     */
    processChildren(config, segmentGroup) {
        const /** @type {?} */ children = mapChildrenIntoArray(segmentGroup, (child, childOutlet) => this.processSegmentGroup(config, child, childOutlet));
        checkOutletNameUniqueness(children);
        sortActivatedRouteSnapshots(children);
        return children;
    }
    /**
     * @param {?} config
     * @param {?} segmentGroup
     * @param {?} segments
     * @param {?} outlet
     * @return {?}
     */
    processSegment(config, segmentGroup, segments, outlet) {
        for (const /** @type {?} */ r of config) {
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
    }
    /**
     * @param {?} segmentGroup
     * @param {?} segments
     * @param {?} outlet
     * @return {?}
     */
    noLeftoversInUrl(segmentGroup, segments, outlet) {
        return segments.length === 0 && !segmentGroup.children[outlet];
    }
    /**
     * @param {?} route
     * @param {?} rawSegment
     * @param {?} segments
     * @param {?} outlet
     * @return {?}
     */
    processSegmentAgainstRoute(route, rawSegment, segments, outlet) {
        if (route.redirectTo)
            throw new NoMatch$1();
        if ((route.outlet || PRIMARY_OUTLET) !== outlet)
            throw new NoMatch$1();
        let /** @type {?} */ snapshot;
        let /** @type {?} */ consumedSegments = [];
        let /** @type {?} */ rawSlicedSegments = [];
        if (route.path === '**') {
            const /** @type {?} */ params = segments.length > 0 ? /** @type {?} */ ((last$1(segments))).parameters : {};
            snapshot = new ActivatedRouteSnapshot(segments, params, Object.freeze(this.urlTree.queryParams), /** @type {?} */ ((this.urlTree.fragment)), getData(route), outlet, /** @type {?} */ ((route.component)), route, getSourceSegmentGroup(rawSegment), getPathIndexShift(rawSegment) + segments.length, getResolve(route));
        }
        else {
            const /** @type {?} */ result = match$1(rawSegment, route, segments);
            consumedSegments = result.consumedSegments;
            rawSlicedSegments = segments.slice(result.lastChild);
            snapshot = new ActivatedRouteSnapshot(consumedSegments, result.parameters, Object.freeze(this.urlTree.queryParams), /** @type {?} */ ((this.urlTree.fragment)), getData(route), outlet, /** @type {?} */ ((route.component)), route, getSourceSegmentGroup(rawSegment), getPathIndexShift(rawSegment) + consumedSegments.length, getResolve(route));
        }
        const /** @type {?} */ childConfig = getChildConfig(route);
        const { segmentGroup, slicedSegments } = split$1(rawSegment, consumedSegments, rawSlicedSegments, childConfig);
        if (slicedSegments.length === 0 && segmentGroup.hasChildren()) {
            const /** @type {?} */ children = this.processChildren(childConfig, segmentGroup);
            return [new TreeNode(snapshot, children)];
        }
        if (childConfig.length === 0 && slicedSegments.length === 0) {
            return [new TreeNode(snapshot, [])];
        }
        const /** @type {?} */ children = this.processSegment(childConfig, segmentGroup, slicedSegments, PRIMARY_OUTLET);
        return [new TreeNode(snapshot, children)];
    }
}
/**
 * @param {?} nodes
 * @return {?}
 */
function sortActivatedRouteSnapshots(nodes) {
    nodes.sort((a, b) => {
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
    const /** @type {?} */ matcher = route.matcher || defaultUrlMatcher;
    const /** @type {?} */ res = matcher(segments, segmentGroup, route);
    if (!res)
        throw new NoMatch$1();
    const /** @type {?} */ posParams = {};
    forEach(/** @type {?} */ ((res.posParams)), (v, k) => { posParams[k] = v.path; });
    const /** @type {?} */ parameters = res.consumed.length > 0 ? Object.assign({}, posParams, res.consumed[res.consumed.length - 1].parameters) :
        posParams;
    return { consumedSegments: res.consumed, lastChild: res.consumed.length, parameters };
}
/**
 * @param {?} nodes
 * @return {?}
 */
function checkOutletNameUniqueness(nodes) {
    const /** @type {?} */ names = {};
    nodes.forEach(n => {
        const /** @type {?} */ routeWithSameOutletName = names[n.value.outlet];
        if (routeWithSameOutletName) {
            const /** @type {?} */ p = routeWithSameOutletName.url.map(s => s.toString()).join('/');
            const /** @type {?} */ c = n.value.url.map(s => s.toString()).join('/');
            throw new Error(`Two segments cannot have the same outlet name: '${p}' and '${c}'.`);
        }
        names[n.value.outlet] = n.value;
    });
}
/**
 * @param {?} segmentGroup
 * @return {?}
 */
function getSourceSegmentGroup(segmentGroup) {
    let /** @type {?} */ s = segmentGroup;
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
    let /** @type {?} */ s = segmentGroup;
    let /** @type {?} */ res = (s._segmentIndexShift ? s._segmentIndexShift : 0);
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
        const /** @type {?} */ s = new UrlSegmentGroup(consumedSegments, createChildrenForEmptyPaths(segmentGroup, consumedSegments, config, new UrlSegmentGroup(slicedSegments, segmentGroup.children)));
        s._sourceSegment = segmentGroup;
        s._segmentIndexShift = consumedSegments.length;
        return { segmentGroup: s, slicedSegments: [] };
    }
    if (slicedSegments.length === 0 &&
        containsEmptyPathMatches(segmentGroup, slicedSegments, config)) {
        const /** @type {?} */ s = new UrlSegmentGroup(segmentGroup.segments, addEmptyPathsToChildrenIfNeeded(segmentGroup, slicedSegments, config, segmentGroup.children));
        s._sourceSegment = segmentGroup;
        s._segmentIndexShift = consumedSegments.length;
        return { segmentGroup: s, slicedSegments };
    }
    const /** @type {?} */ s = new UrlSegmentGroup(segmentGroup.segments, segmentGroup.children);
    s._sourceSegment = segmentGroup;
    s._segmentIndexShift = consumedSegments.length;
    return { segmentGroup: s, slicedSegments };
}
/**
 * @param {?} segmentGroup
 * @param {?} slicedSegments
 * @param {?} routes
 * @param {?} children
 * @return {?}
 */
function addEmptyPathsToChildrenIfNeeded(segmentGroup, slicedSegments, routes, children) {
    const /** @type {?} */ res = {};
    for (const /** @type {?} */ r of routes) {
        if (emptyPathMatch(segmentGroup, slicedSegments, r) && !children[getOutlet$1(r)]) {
            const /** @type {?} */ s = new UrlSegmentGroup([], {});
            s._sourceSegment = segmentGroup;
            s._segmentIndexShift = segmentGroup.segments.length;
            res[getOutlet$1(r)] = s;
        }
    }
    return Object.assign({}, children, res);
}
/**
 * @param {?} segmentGroup
 * @param {?} consumedSegments
 * @param {?} routes
 * @param {?} primarySegment
 * @return {?}
 */
function createChildrenForEmptyPaths(segmentGroup, consumedSegments, routes, primarySegment) {
    const /** @type {?} */ res = {};
    res[PRIMARY_OUTLET] = primarySegment;
    primarySegment._sourceSegment = segmentGroup;
    primarySegment._segmentIndexShift = consumedSegments.length;
    for (const /** @type {?} */ r of routes) {
        if (r.path === '' && getOutlet$1(r) !== PRIMARY_OUTLET) {
            const /** @type {?} */ s = new UrlSegmentGroup([], {});
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
    return routes.some(r => emptyPathMatch(segmentGroup, slicedSegments, r) && getOutlet$1(r) !== PRIMARY_OUTLET);
}
/**
 * @param {?} segmentGroup
 * @param {?} slicedSegments
 * @param {?} routes
 * @return {?}
 */
function containsEmptyPathMatches(segmentGroup, slicedSegments, routes) {
    return routes.some(r => emptyPathMatch(segmentGroup, slicedSegments, r));
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
class RouteReuseStrategy {
}
/**
 * Does not detach any subtrees. Reuses routes as long as their route config is the same.
 */
class DefaultRouteReuseStrategy {
    /**
     * @param {?} route
     * @return {?}
     */
    shouldDetach(route) { return false; }
    /**
     * @param {?} route
     * @param {?} detachedTree
     * @return {?}
     */
    store(route, detachedTree) { }
    /**
     * @param {?} route
     * @return {?}
     */
    shouldAttach(route) { return false; }
    /**
     * @param {?} route
     * @return {?}
     */
    retrieve(route) { return null; }
    /**
     * @param {?} future
     * @param {?} curr
     * @return {?}
     */
    shouldReuseRoute(future, curr) {
        return future.routeConfig === curr.routeConfig;
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
 * \@docsNotRequired
 * \@experimental
 */
const ROUTES = new InjectionToken('ROUTES');
class RouterConfigLoader {
    /**
     * @param {?} loader
     * @param {?} compiler
     * @param {?=} onLoadStartListener
     * @param {?=} onLoadEndListener
     */
    constructor(loader, compiler, onLoadStartListener, onLoadEndListener) {
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
    load(parentInjector, route) {
        if (this.onLoadStartListener) {
            this.onLoadStartListener(route);
        }
        const /** @type {?} */ moduleFactory$ = this.loadModuleFactory(/** @type {?} */ ((route.loadChildren)));
        return map.call(moduleFactory$, (factory) => {
            if (this.onLoadEndListener) {
                this.onLoadEndListener(route);
            }
            const /** @type {?} */ module = factory.create(parentInjector);
            return new LoadedRouterConfig(flatten(module.injector.get(ROUTES)), module);
        });
    }
    /**
     * @param {?} loadChildren
     * @return {?}
     */
    loadModuleFactory(loadChildren) {
        if (typeof loadChildren === 'string') {
            return fromPromise(this.loader.load(loadChildren));
        }
        else {
            return mergeMap.call(wrapIntoObservable(loadChildren()), (t) => {
                if (t instanceof NgModuleFactory) {
                    return of(t);
                }
                else {
                    return fromPromise(this.compiler.compileModuleAsync(t));
                }
            });
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
 * \@whatItDoes Provides a way to migrate AngularJS applications to Angular.
 *
 * \@experimental
 * @abstract
 */
class UrlHandlingStrategy {
}
/**
 * \@experimental
 */
class DefaultUrlHandlingStrategy {
    /**
     * @param {?} url
     * @return {?}
     */
    shouldProcessUrl(url) { return true; }
    /**
     * @param {?} url
     * @return {?}
     */
    extract(url) { return url; }
    /**
     * @param {?} newUrlPart
     * @param {?} wholeUrl
     * @return {?}
     */
    merge(newUrlPart, wholeUrl) { return newUrlPart; }
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
class Router {
    /**
     * Creates the router service.
     * @param {?} rootComponentType
     * @param {?} urlSerializer
     * @param {?} rootContexts
     * @param {?} location
     * @param {?} injector
     * @param {?} loader
     * @param {?} compiler
     * @param {?} config
     */
    constructor(rootComponentType, urlSerializer, rootContexts, location, injector, loader, compiler, config) {
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
        const /** @type {?} */ onLoadStart = (r) => this.triggerEvent(new RouteConfigLoadStart(r));
        const /** @type {?} */ onLoadEnd = (r) => this.triggerEvent(new RouteConfigLoadEnd(r));
        this.ngModule = injector.get(NgModuleRef);
        this.resetConfig(config);
        this.currentUrlTree = createEmptyUrlTree();
        this.rawUrlTree = this.currentUrlTree;
        this.configLoader = new RouterConfigLoader(loader, compiler, onLoadStart, onLoadEnd);
        this.routerState = createEmptyState(this.currentUrlTree, this.rootComponentType);
        this.processNavigations();
    }
    /**
     * \@internal
     * TODO: this should be removed once the constructor of the router made internal
     * @param {?} rootComponentType
     * @return {?}
     */
    resetRootComponentType(rootComponentType) {
        this.rootComponentType = rootComponentType;
        // TODO: vsavkin router 4.0 should make the root component set to null
        // this will simplify the lifecycle of the router.
        this.routerState.root.component = this.rootComponentType;
    }
    /**
     * Sets up the location change listener and performs the initial navigation.
     * @return {?}
     */
    initialNavigation() {
        this.setUpLocationChangeListener();
        if (this.navigationId === 0) {
            this.navigateByUrl(this.location.path(true), { replaceUrl: true });
        }
    }
    /**
     * Sets up the location change listener.
     * @return {?}
     */
    setUpLocationChangeListener() {
        // Don't need to use Zone.wrap any more, because zone.js
        // already patch onPopState, so location change callback will
        // run into ngZone
        if (!this.locationSubscription) {
            this.locationSubscription = /** @type {?} */ (this.location.subscribe((change) => {
                const /** @type {?} */ rawUrlTree = this.urlSerializer.parse(change['url']);
                const /** @type {?} */ source = change['type'] === 'popstate' ? 'popstate' : 'hashchange';
                const /** @type {?} */ state = change.state && change.state.navigationId ?
                    { navigationId: change.state.navigationId } :
                    null;
                setTimeout(() => { this.scheduleNavigation(rawUrlTree, source, state, { replaceUrl: true }); }, 0);
            }));
        }
    }
    /**
     * The current url
     * @return {?}
     */
    get url() { return this.serializeUrl(this.currentUrlTree); }
    /**
     * \@internal
     * @param {?} e
     * @return {?}
     */
    triggerEvent(e) { (/** @type {?} */ (this.events)).next(e); }
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
    resetConfig(config) {
        validateConfig(config);
        this.config = config;
        this.navigated = false;
        this.lastSuccessfulId = -1;
    }
    /**
     * \@docsNotRequired
     * @return {?}
     */
    ngOnDestroy() { this.dispose(); }
    /**
     * Disposes of the router
     * @return {?}
     */
    dispose() {
        if (this.locationSubscription) {
            this.locationSubscription.unsubscribe();
            this.locationSubscription = /** @type {?} */ ((null));
        }
    }
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
    createUrlTree(commands, navigationExtras = {}) {
        const { relativeTo, queryParams, fragment, preserveQueryParams, queryParamsHandling, preserveFragment } = navigationExtras;
        if (isDevMode() && preserveQueryParams && /** @type {?} */ (console) && /** @type {?} */ (console.warn)) {
            console.warn('preserveQueryParams is deprecated, use queryParamsHandling instead.');
        }
        const /** @type {?} */ a = relativeTo || this.routerState.root;
        const /** @type {?} */ f = preserveFragment ? this.currentUrlTree.fragment : fragment;
        let /** @type {?} */ q = null;
        if (queryParamsHandling) {
            switch (queryParamsHandling) {
                case 'merge':
                    q = Object.assign({}, this.currentUrlTree.queryParams, queryParams);
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
    }
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
    navigateByUrl(url, extras = { skipLocationChange: false }) {
        const /** @type {?} */ urlTree = url instanceof UrlTree ? url : this.parseUrl(url);
        const /** @type {?} */ mergedTree = this.urlHandlingStrategy.merge(urlTree, this.rawUrlTree);
        return this.scheduleNavigation(mergedTree, 'imperative', null, extras);
    }
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
    navigate(commands, extras = { skipLocationChange: false }) {
        validateCommands(commands);
        return this.navigateByUrl(this.createUrlTree(commands, extras), extras);
    }
    /**
     * Serializes a {\@link UrlTree} into a string
     * @param {?} url
     * @return {?}
     */
    serializeUrl(url) { return this.urlSerializer.serialize(url); }
    /**
     * Parses a string into a {\@link UrlTree}
     * @param {?} url
     * @return {?}
     */
    parseUrl(url) { return this.urlSerializer.parse(url); }
    /**
     * Returns whether the url is activated
     * @param {?} url
     * @param {?} exact
     * @return {?}
     */
    isActive(url, exact) {
        if (url instanceof UrlTree) {
            return containsTree(this.currentUrlTree, url, exact);
        }
        const /** @type {?} */ urlTree = this.urlSerializer.parse(url);
        return containsTree(this.currentUrlTree, urlTree, exact);
    }
    /**
     * @param {?} params
     * @return {?}
     */
    removeEmptyProps(params) {
        return Object.keys(params).reduce((result, key) => {
            const /** @type {?} */ value = params[key];
            if (value !== null && value !== undefined) {
                result[key] = value;
            }
            return result;
        }, {});
    }
    /**
     * @return {?}
     */
    processNavigations() {
        concatMap
            .call(this.navigations, (nav) => {
            if (nav) {
                this.executeScheduledNavigation(nav);
                // a failed navigation should not stop the router from processing
                // further navigations => the catch
                return nav.promise.catch(() => { });
            }
            else {
                return /** @type {?} */ (of(null));
            }
        })
            .subscribe(() => { });
    }
    /**
     * @param {?} rawUrl
     * @param {?} source
     * @param {?} state
     * @param {?} extras
     * @return {?}
     */
    scheduleNavigation(rawUrl, source, state, extras) {
        const /** @type {?} */ lastNavigation = this.navigations.value;
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
        let /** @type {?} */ resolve = null;
        let /** @type {?} */ reject = null;
        const /** @type {?} */ promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        const /** @type {?} */ id = ++this.navigationId;
        this.navigations.next({ id, source, state, rawUrl, extras, resolve, reject, promise });
        // Make sure that the error is propagated even though `processNavigations` catch
        // handler does not rethrow
        return promise.catch((e) => Promise.reject(e));
    }
    /**
     * @param {?} __0
     * @return {?}
     */
    executeScheduledNavigation({ id, rawUrl, extras, resolve, reject, source, state }) {
        const /** @type {?} */ url = this.urlHandlingStrategy.extract(rawUrl);
        const /** @type {?} */ urlTransition = !this.navigated || url.toString() !== this.currentUrlTree.toString();
        if ((this.onSameUrlNavigation === 'reload' ? true : urlTransition) &&
            this.urlHandlingStrategy.shouldProcessUrl(rawUrl)) {
            (/** @type {?} */ (this.events))
                .next(new NavigationStart(id, this.serializeUrl(url), source, state));
            Promise.resolve()
                .then((_) => this.runNavigate(url, rawUrl, !!extras.skipLocationChange, !!extras.replaceUrl, id, null))
                .then(resolve, reject);
            // we cannot process the current URL, but we could process the previous one =>
            // we need to do some cleanup
        }
        else if (urlTransition && this.rawUrlTree &&
            this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)) {
            (/** @type {?} */ (this.events))
                .next(new NavigationStart(id, this.serializeUrl(url), source, state));
            Promise.resolve()
                .then((_) => this.runNavigate(url, rawUrl, false, false, id, createEmptyState(url, this.rootComponentType).snapshot))
                .then(resolve, reject);
        }
        else {
            this.rawUrlTree = rawUrl;
            resolve(null);
        }
    }
    /**
     * @param {?} url
     * @param {?} rawUrl
     * @param {?} skipLocationChange
     * @param {?} replaceUrl
     * @param {?} id
     * @param {?} precreatedState
     * @return {?}
     */
    runNavigate(url, rawUrl, skipLocationChange, replaceUrl, id, precreatedState) {
        if (id !== this.navigationId) {
            (/** @type {?} */ (this.events))
                .next(new NavigationCancel(id, this.serializeUrl(url), `Navigation ID ${id} is not equal to the current navigation id ${this.navigationId}`));
            return Promise.resolve(false);
        }
        return new Promise((resolvePromise, rejectPromise) => {
            // create an observable of the url and route state snapshot
            // this operation do not result in any side effects
            let /** @type {?} */ urlAndSnapshot$;
            if (!precreatedState) {
                const /** @type {?} */ moduleInjector = this.ngModule.injector;
                const /** @type {?} */ redirectsApplied$ = applyRedirects(moduleInjector, this.configLoader, this.urlSerializer, url, this.config);
                urlAndSnapshot$ = mergeMap.call(redirectsApplied$, (appliedUrl) => {
                    return map.call(recognize(this.rootComponentType, this.config, appliedUrl, this.serializeUrl(appliedUrl), this.paramsInheritanceStrategy), (snapshot) => {
                        (/** @type {?} */ (this.events))
                            .next(new RoutesRecognized(id, this.serializeUrl(url), this.serializeUrl(appliedUrl), snapshot));
                        return { appliedUrl, snapshot };
                    });
                });
            }
            else {
                urlAndSnapshot$ = of({ appliedUrl: url, snapshot: precreatedState });
            }
            const /** @type {?} */ beforePreactivationDone$ = mergeMap.call(urlAndSnapshot$, (p) => {
                return map.call(this.hooks.beforePreactivation(p.snapshot), () => p);
            });
            // run preactivation: guards and data resolvers
            let /** @type {?} */ preActivation;
            const /** @type {?} */ preactivationSetup$ = map.call(beforePreactivationDone$, ({ appliedUrl, snapshot }) => {
                const /** @type {?} */ moduleInjector = this.ngModule.injector;
                preActivation = new PreActivation(snapshot, this.routerState.snapshot, moduleInjector, (evt) => this.triggerEvent(evt));
                preActivation.initialize(this.rootContexts);
                return { appliedUrl, snapshot };
            });
            const /** @type {?} */ preactivationCheckGuards$ = mergeMap.call(preactivationSetup$, ({ appliedUrl, snapshot }) => {
                if (this.navigationId !== id)
                    return of(false);
                this.triggerEvent(new GuardsCheckStart(id, this.serializeUrl(url), appliedUrl, snapshot));
                return map.call(preActivation.checkGuards(), (shouldActivate) => {
                    this.triggerEvent(new GuardsCheckEnd(id, this.serializeUrl(url), appliedUrl, snapshot, shouldActivate));
                    return { appliedUrl: appliedUrl, snapshot: snapshot, shouldActivate: shouldActivate };
                });
            });
            const /** @type {?} */ preactivationResolveData$ = mergeMap.call(preactivationCheckGuards$, (p) => {
                if (this.navigationId !== id)
                    return of(false);
                if (p.shouldActivate && preActivation.isActivating()) {
                    this.triggerEvent(new ResolveStart(id, this.serializeUrl(url), p.appliedUrl, p.snapshot));
                    return map.call(preActivation.resolveData(this.paramsInheritanceStrategy), () => {
                        this.triggerEvent(new ResolveEnd(id, this.serializeUrl(url), p.appliedUrl, p.snapshot));
                        return p;
                    });
                }
                else {
                    return of(p);
                }
            });
            const /** @type {?} */ preactivationDone$ = mergeMap.call(preactivationResolveData$, (p) => {
                return map.call(this.hooks.afterPreactivation(p.snapshot), () => p);
            });
            // create router state
            // this operation has side effects => route state is being affected
            const /** @type {?} */ routerState$ = map.call(preactivationDone$, ({ appliedUrl, snapshot, shouldActivate }) => {
                if (shouldActivate) {
                    const /** @type {?} */ state = createRouterState(this.routeReuseStrategy, snapshot, this.routerState);
                    return { appliedUrl, state, shouldActivate };
                }
                else {
                    return { appliedUrl, state: null, shouldActivate };
                }
            });
            this.activateRoutes(routerState$, this.routerState, this.currentUrlTree, id, url, rawUrl, skipLocationChange, replaceUrl, resolvePromise, rejectPromise);
        });
    }
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
    activateRoutes(state, storedState, storedUrl, id, url, rawUrl, skipLocationChange, replaceUrl, resolvePromise, rejectPromise) {
        // applied the new router state
        // this operation has side effects
        let /** @type {?} */ navigationIsSuccessful;
        state
            .forEach(({ appliedUrl, state, shouldActivate }) => {
            if (!shouldActivate || id !== this.navigationId) {
                navigationIsSuccessful = false;
                return;
            }
            this.currentUrlTree = appliedUrl;
            this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, rawUrl);
            (/** @type {?} */ (this)).routerState = state;
            if (!skipLocationChange) {
                const /** @type {?} */ path = this.urlSerializer.serialize(this.rawUrlTree);
                if (this.location.isCurrentPathEqualTo(path) || replaceUrl) {
                    this.location.replaceState(path, '', { navigationId: id });
                }
                else {
                    this.location.go(path, '', { navigationId: id });
                }
            }
            new ActivateRoutes(this.routeReuseStrategy, state, storedState, (evt) => this.triggerEvent(evt))
                .activate(this.rootContexts);
            navigationIsSuccessful = true;
        })
            .then(() => {
            if (navigationIsSuccessful) {
                this.navigated = true;
                this.lastSuccessfulId = id;
                (/** @type {?} */ (this.events))
                    .next(new NavigationEnd(id, this.serializeUrl(url), this.serializeUrl(this.currentUrlTree)));
                resolvePromise(true);
            }
            else {
                this.resetUrlToCurrentUrlTree();
                (/** @type {?} */ (this.events))
                    .next(new NavigationCancel(id, this.serializeUrl(url), ''));
                resolvePromise(false);
            }
        }, (e) => {
            if (isNavigationCancelingError(e)) {
                this.navigated = true;
                this.resetStateAndUrl(storedState, storedUrl, rawUrl);
                (/** @type {?} */ (this.events))
                    .next(new NavigationCancel(id, this.serializeUrl(url), e.message));
                resolvePromise(false);
            }
            else {
                this.resetStateAndUrl(storedState, storedUrl, rawUrl);
                (/** @type {?} */ (this.events))
                    .next(new NavigationError(id, this.serializeUrl(url), e));
                try {
                    resolvePromise(this.errorHandler(e));
                }
                catch (/** @type {?} */ ee) {
                    rejectPromise(ee);
                }
            }
        });
    }
    /**
     * @param {?} storedState
     * @param {?} storedUrl
     * @param {?} rawUrl
     * @return {?}
     */
    resetStateAndUrl(storedState, storedUrl, rawUrl) {
        (/** @type {?} */ (this)).routerState = storedState;
        this.currentUrlTree = storedUrl;
        this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, rawUrl);
        this.resetUrlToCurrentUrlTree();
    }
    /**
     * @return {?}
     */
    resetUrlToCurrentUrlTree() {
        this.location.replaceState(this.urlSerializer.serialize(this.rawUrlTree), '', { navigationId: this.lastSuccessfulId });
    }
}
class ActivateRoutes {
    /**
     * @param {?} routeReuseStrategy
     * @param {?} futureState
     * @param {?} currState
     * @param {?} forwardEvent
     */
    constructor(routeReuseStrategy, futureState, currState, forwardEvent) {
        this.routeReuseStrategy = routeReuseStrategy;
        this.futureState = futureState;
        this.currState = currState;
        this.forwardEvent = forwardEvent;
    }
    /**
     * @param {?} parentContexts
     * @return {?}
     */
    activate(parentContexts) {
        const /** @type {?} */ futureRoot = this.futureState._root;
        const /** @type {?} */ currRoot = this.currState ? this.currState._root : null;
        this.deactivateChildRoutes(futureRoot, currRoot, parentContexts);
        advanceActivatedRoute(this.futureState.root);
        this.activateChildRoutes(futureRoot, currRoot, parentContexts);
    }
    /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} contexts
     * @return {?}
     */
    deactivateChildRoutes(futureNode, currNode, contexts) {
        const /** @type {?} */ children = nodeChildrenAsMap(currNode);
        // Recurse on the routes active in the future state to de-activate deeper children
        futureNode.children.forEach(futureChild => {
            const /** @type {?} */ childOutletName = futureChild.value.outlet;
            this.deactivateRoutes(futureChild, children[childOutletName], contexts);
            delete children[childOutletName];
        });
        // De-activate the routes that will not be re-used
        forEach(children, (v, childName) => {
            this.deactivateRouteAndItsChildren(v, contexts);
        });
    }
    /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} parentContext
     * @return {?}
     */
    deactivateRoutes(futureNode, currNode, parentContext) {
        const /** @type {?} */ future = futureNode.value;
        const /** @type {?} */ curr = currNode ? currNode.value : null;
        if (future === curr) {
            // Reusing the node, check to see if the children need to be de-activated
            if (future.component) {
                // If we have a normal route, we need to go through an outlet.
                const /** @type {?} */ context = parentContext.getContext(future.outlet);
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
    }
    /**
     * @param {?} route
     * @param {?} parentContexts
     * @return {?}
     */
    deactivateRouteAndItsChildren(route, parentContexts) {
        if (this.routeReuseStrategy.shouldDetach(route.value.snapshot)) {
            this.detachAndStoreRouteSubtree(route, parentContexts);
        }
        else {
            this.deactivateRouteAndOutlet(route, parentContexts);
        }
    }
    /**
     * @param {?} route
     * @param {?} parentContexts
     * @return {?}
     */
    detachAndStoreRouteSubtree(route, parentContexts) {
        const /** @type {?} */ context = parentContexts.getContext(route.value.outlet);
        if (context && context.outlet) {
            const /** @type {?} */ componentRef = context.outlet.detach();
            const /** @type {?} */ contexts = context.children.onOutletDeactivated();
            this.routeReuseStrategy.store(route.value.snapshot, { componentRef, route, contexts });
        }
    }
    /**
     * @param {?} route
     * @param {?} parentContexts
     * @return {?}
     */
    deactivateRouteAndOutlet(route, parentContexts) {
        const /** @type {?} */ context = parentContexts.getContext(route.value.outlet);
        if (context) {
            const /** @type {?} */ children = nodeChildrenAsMap(route);
            const /** @type {?} */ contexts = route.value.component ? context.children : parentContexts;
            forEach(children, (v, k) => this.deactivateRouteAndItsChildren(v, contexts));
            if (context.outlet) {
                // Destroy the component
                context.outlet.deactivate();
                // Destroy the contexts for all the outlets that were in the component
                context.children.onOutletDeactivated();
            }
        }
    }
    /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} contexts
     * @return {?}
     */
    activateChildRoutes(futureNode, currNode, contexts) {
        const /** @type {?} */ children = nodeChildrenAsMap(currNode);
        futureNode.children.forEach(c => {
            this.activateRoutes(c, children[c.value.outlet], contexts);
            this.forwardEvent(new ActivationEnd(c.value.snapshot));
        });
        if (futureNode.children.length) {
            this.forwardEvent(new ChildActivationEnd(futureNode.value.snapshot));
        }
    }
    /**
     * @param {?} futureNode
     * @param {?} currNode
     * @param {?} parentContexts
     * @return {?}
     */
    activateRoutes(futureNode, currNode, parentContexts) {
        const /** @type {?} */ future = futureNode.value;
        const /** @type {?} */ curr = currNode ? currNode.value : null;
        advanceActivatedRoute(future);
        // reusing the node
        if (future === curr) {
            if (future.component) {
                // If we have a normal route, we need to go through an outlet.
                const /** @type {?} */ context = parentContexts.getOrCreateContext(future.outlet);
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
                const /** @type {?} */ context = parentContexts.getOrCreateContext(future.outlet);
                if (this.routeReuseStrategy.shouldAttach(future.snapshot)) {
                    const /** @type {?} */ stored = (/** @type {?} */ (this.routeReuseStrategy.retrieve(future.snapshot)));
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
                    const /** @type {?} */ config = parentLoadedConfig(future.snapshot);
                    const /** @type {?} */ cmpFactoryResolver = config ? config.module.componentFactoryResolver : null;
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
    }
}
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
    for (let /** @type {?} */ s = snapshot.parent; s; s = s.parent) {
        const /** @type {?} */ route = s.routeConfig;
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
    for (let /** @type {?} */ i = 0; i < commands.length; i++) {
        const /** @type {?} */ cmd = commands[i];
        if (cmd == null) {
            throw new Error(`The requested path contains ${cmd} segment at index ${i}`);
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
class RouterLink {
    /**
     * @param {?} router
     * @param {?} route
     * @param {?} tabIndex
     * @param {?} renderer
     * @param {?} el
     */
    constructor(router, route, tabIndex, renderer, el) {
        this.router = router;
        this.route = route;
        this.commands = [];
        if (tabIndex == null) {
            renderer.setAttribute(el.nativeElement, 'tabindex', '0');
        }
    }
    /**
     * @param {?} commands
     * @return {?}
     */
    set routerLink(commands) {
        if (commands != null) {
            this.commands = Array.isArray(commands) ? commands : [commands];
        }
        else {
            this.commands = [];
        }
    }
    /**
     * @deprecated 4.0.0 use `queryParamsHandling` instead.
     * @param {?} value
     * @return {?}
     */
    set preserveQueryParams(value) {
        if (isDevMode() && /** @type {?} */ (console) && /** @type {?} */ (console.warn)) {
            console.warn('preserveQueryParams is deprecated!, use queryParamsHandling instead.');
        }
        this.preserve = value;
    }
    /**
     * @return {?}
     */
    onClick() {
        const /** @type {?} */ extras = {
            skipLocationChange: attrBoolValue(this.skipLocationChange),
            replaceUrl: attrBoolValue(this.replaceUrl),
        };
        this.router.navigateByUrl(this.urlTree, extras);
        return true;
    }
    /**
     * @return {?}
     */
    get urlTree() {
        return this.router.createUrlTree(this.commands, {
            relativeTo: this.route,
            queryParams: this.queryParams,
            fragment: this.fragment,
            preserveQueryParams: attrBoolValue(this.preserve),
            queryParamsHandling: this.queryParamsHandling,
            preserveFragment: attrBoolValue(this.preserveFragment),
        });
    }
}
RouterLink.decorators = [
    { type: Directive, args: [{ selector: ':not(a)[routerLink]' },] },
];
/** @nocollapse */
RouterLink.ctorParameters = () => [
    { type: Router, },
    { type: ActivatedRoute, },
    { type: undefined, decorators: [{ type: Attribute, args: ['tabindex',] },] },
    { type: Renderer2, },
    { type: ElementRef, },
];
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
/**
 * \@whatItDoes Lets you link to specific parts of your app.
 *
 * See {\@link RouterLink} for more information.
 *
 * \@ngModule RouterModule
 *
 * \@stable
 */
class RouterLinkWithHref {
    /**
     * @param {?} router
     * @param {?} route
     * @param {?} locationStrategy
     */
    constructor(router, route, locationStrategy) {
        this.router = router;
        this.route = route;
        this.locationStrategy = locationStrategy;
        this.commands = [];
        this.subscription = router.events.subscribe(s => {
            if (s instanceof NavigationEnd) {
                this.updateTargetUrlAndHref();
            }
        });
    }
    /**
     * @param {?} commands
     * @return {?}
     */
    set routerLink(commands) {
        if (commands != null) {
            this.commands = Array.isArray(commands) ? commands : [commands];
        }
        else {
            this.commands = [];
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set preserveQueryParams(value) {
        if (isDevMode() && /** @type {?} */ (console) && /** @type {?} */ (console.warn)) {
            console.warn('preserveQueryParams is deprecated, use queryParamsHandling instead.');
        }
        this.preserve = value;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) { this.updateTargetUrlAndHref(); }
    /**
     * @return {?}
     */
    ngOnDestroy() { this.subscription.unsubscribe(); }
    /**
     * @param {?} button
     * @param {?} ctrlKey
     * @param {?} metaKey
     * @param {?} shiftKey
     * @return {?}
     */
    onClick(button, ctrlKey, metaKey, shiftKey) {
        if (button !== 0 || ctrlKey || metaKey || shiftKey) {
            return true;
        }
        if (typeof this.target === 'string' && this.target != '_self') {
            return true;
        }
        const /** @type {?} */ extras = {
            skipLocationChange: attrBoolValue(this.skipLocationChange),
            replaceUrl: attrBoolValue(this.replaceUrl),
        };
        this.router.navigateByUrl(this.urlTree, extras);
        return false;
    }
    /**
     * @return {?}
     */
    updateTargetUrlAndHref() {
        this.href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.urlTree));
    }
    /**
     * @return {?}
     */
    get urlTree() {
        return this.router.createUrlTree(this.commands, {
            relativeTo: this.route,
            queryParams: this.queryParams,
            fragment: this.fragment,
            preserveQueryParams: attrBoolValue(this.preserve),
            queryParamsHandling: this.queryParamsHandling,
            preserveFragment: attrBoolValue(this.preserveFragment),
        });
    }
}
RouterLinkWithHref.decorators = [
    { type: Directive, args: [{ selector: 'a[routerLink]' },] },
];
/** @nocollapse */
RouterLinkWithHref.ctorParameters = () => [
    { type: Router, },
    { type: ActivatedRoute, },
    { type: LocationStrategy, },
];
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
class RouterLinkActive {
    /**
     * @param {?} router
     * @param {?} element
     * @param {?} renderer
     * @param {?} cdr
     */
    constructor(router, element, renderer, cdr) {
        this.router = router;
        this.element = element;
        this.renderer = renderer;
        this.cdr = cdr;
        this.classes = [];
        this.isActive = false;
        this.routerLinkActiveOptions = { exact: false };
        this.subscription = router.events.subscribe(s => {
            if (s instanceof NavigationEnd) {
                this.update();
            }
        });
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this.links.changes.subscribe(_ => this.update());
        this.linksWithHrefs.changes.subscribe(_ => this.update());
        this.update();
    }
    /**
     * @param {?} data
     * @return {?}
     */
    set routerLinkActive(data) {
        const /** @type {?} */ classes = Array.isArray(data) ? data : data.split(' ');
        this.classes = classes.filter(c => !!c);
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) { this.update(); }
    /**
     * @return {?}
     */
    ngOnDestroy() { this.subscription.unsubscribe(); }
    /**
     * @return {?}
     */
    update() {
        if (!this.links || !this.linksWithHrefs || !this.router.navigated)
            return;
        Promise.resolve().then(() => {
            const /** @type {?} */ hasActiveLinks = this.hasActiveLinks();
            if (this.isActive !== hasActiveLinks) {
                (/** @type {?} */ (this)).isActive = hasActiveLinks;
                this.classes.forEach((c) => {
                    if (hasActiveLinks) {
                        this.renderer.addClass(this.element.nativeElement, c);
                    }
                    else {
                        this.renderer.removeClass(this.element.nativeElement, c);
                    }
                });
            }
        });
    }
    /**
     * @param {?} router
     * @return {?}
     */
    isLinkActive(router) {
        return (link) => router.isActive(link.urlTree, this.routerLinkActiveOptions.exact);
    }
    /**
     * @return {?}
     */
    hasActiveLinks() {
        return this.links.some(this.isLinkActive(this.router)) ||
            this.linksWithHrefs.some(this.isLinkActive(this.router));
    }
}
RouterLinkActive.decorators = [
    { type: Directive, args: [{
                selector: '[routerLinkActive]',
                exportAs: 'routerLinkActive',
            },] },
];
/** @nocollapse */
RouterLinkActive.ctorParameters = () => [
    { type: Router, },
    { type: ElementRef, },
    { type: Renderer2, },
    { type: ChangeDetectorRef, },
];
RouterLinkActive.propDecorators = {
    "links": [{ type: ContentChildren, args: [RouterLink, { descendants: true },] },],
    "linksWithHrefs": [{ type: ContentChildren, args: [RouterLinkWithHref, { descendants: true },] },],
    "routerLinkActiveOptions": [{ type: Input },],
    "routerLinkActive": [{ type: Input },],
};

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
class OutletContext {
    constructor() {
        this.outlet = null;
        this.route = null;
        this.resolver = null;
        this.children = new ChildrenOutletContexts();
        this.attachRef = null;
    }
}
/**
 * Store contextual information about the children (= nested) {\@link RouterOutlet}
 *
 * \@stable
 */
class ChildrenOutletContexts {
    constructor() {
        this.contexts = new Map();
    }
    /**
     * Called when a `RouterOutlet` directive is instantiated
     * @param {?} childName
     * @param {?} outlet
     * @return {?}
     */
    onChildOutletCreated(childName, outlet) {
        const /** @type {?} */ context = this.getOrCreateContext(childName);
        context.outlet = outlet;
        this.contexts.set(childName, context);
    }
    /**
     * Called when a `RouterOutlet` directive is destroyed.
     * We need to keep the context as the outlet could be destroyed inside a NgIf and might be
     * re-created later.
     * @param {?} childName
     * @return {?}
     */
    onChildOutletDestroyed(childName) {
        const /** @type {?} */ context = this.getContext(childName);
        if (context) {
            context.outlet = null;
        }
    }
    /**
     * Called when the corresponding route is deactivated during navigation.
     * Because the component get destroyed, all children outlet are destroyed.
     * @return {?}
     */
    onOutletDeactivated() {
        const /** @type {?} */ contexts = this.contexts;
        this.contexts = new Map();
        return contexts;
    }
    /**
     * @param {?} contexts
     * @return {?}
     */
    onOutletReAttached(contexts) { this.contexts = contexts; }
    /**
     * @param {?} childName
     * @return {?}
     */
    getOrCreateContext(childName) {
        let /** @type {?} */ context = this.getContext(childName);
        if (!context) {
            context = new OutletContext();
            this.contexts.set(childName, context);
        }
        return context;
    }
    /**
     * @param {?} childName
     * @return {?}
     */
    getContext(childName) { return this.contexts.get(childName) || null; }
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
class RouterOutlet {
    /**
     * @param {?} parentContexts
     * @param {?} location
     * @param {?} resolver
     * @param {?} name
     * @param {?} changeDetector
     */
    constructor(parentContexts, location, resolver, name, changeDetector) {
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
    ngOnDestroy() { this.parentContexts.onChildOutletDestroyed(this.name); }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (!this.activated) {
            // If the outlet was not instantiated at the time the route got activated we need to populate
            // the outlet when it is initialized (ie inside a NgIf)
            const /** @type {?} */ context = this.parentContexts.getContext(this.name);
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
    }
    /**
     * @return {?}
     */
    get isActivated() { return !!this.activated; }
    /**
     * @return {?}
     */
    get component() {
        if (!this.activated)
            throw new Error('Outlet is not activated');
        return this.activated.instance;
    }
    /**
     * @return {?}
     */
    get activatedRoute() {
        if (!this.activated)
            throw new Error('Outlet is not activated');
        return /** @type {?} */ (this._activatedRoute);
    }
    /**
     * @return {?}
     */
    get activatedRouteData() {
        if (this._activatedRoute) {
            return this._activatedRoute.snapshot.data;
        }
        return {};
    }
    /**
     * Called when the `RouteReuseStrategy` instructs to detach the subtree
     * @return {?}
     */
    detach() {
        if (!this.activated)
            throw new Error('Outlet is not activated');
        this.location.detach();
        const /** @type {?} */ cmp = this.activated;
        this.activated = null;
        this._activatedRoute = null;
        return cmp;
    }
    /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     * @param {?} ref
     * @param {?} activatedRoute
     * @return {?}
     */
    attach(ref, activatedRoute) {
        this.activated = ref;
        this._activatedRoute = activatedRoute;
        this.location.insert(ref.hostView);
    }
    /**
     * @return {?}
     */
    deactivate() {
        if (this.activated) {
            const /** @type {?} */ c = this.component;
            this.activated.destroy();
            this.activated = null;
            this._activatedRoute = null;
            this.deactivateEvents.emit(c);
        }
    }
    /**
     * @param {?} activatedRoute
     * @param {?} resolver
     * @return {?}
     */
    activateWith(activatedRoute, resolver) {
        if (this.isActivated) {
            throw new Error('Cannot activate an already activated outlet');
        }
        this._activatedRoute = activatedRoute;
        const /** @type {?} */ snapshot = activatedRoute._futureSnapshot;
        const /** @type {?} */ component = /** @type {?} */ (/** @type {?} */ ((snapshot.routeConfig)).component);
        resolver = resolver || this.resolver;
        const /** @type {?} */ factory = resolver.resolveComponentFactory(component);
        const /** @type {?} */ childContexts = this.parentContexts.getOrCreateContext(this.name).children;
        const /** @type {?} */ injector = new OutletInjector(activatedRoute, childContexts, this.location.injector);
        this.activated = this.location.createComponent(factory, this.location.length, injector);
        // Calling `markForCheck` to make sure we will run the change detection when the
        // `RouterOutlet` is inside a `ChangeDetectionStrategy.OnPush` component.
        this.changeDetector.markForCheck();
        this.activateEvents.emit(this.activated.instance);
    }
}
RouterOutlet.decorators = [
    { type: Directive, args: [{ selector: 'router-outlet', exportAs: 'outlet' },] },
];
/** @nocollapse */
RouterOutlet.ctorParameters = () => [
    { type: ChildrenOutletContexts, },
    { type: ViewContainerRef, },
    { type: ComponentFactoryResolver, },
    { type: undefined, decorators: [{ type: Attribute, args: ['name',] },] },
    { type: ChangeDetectorRef, },
];
RouterOutlet.propDecorators = {
    "activateEvents": [{ type: Output, args: ['activate',] },],
    "deactivateEvents": [{ type: Output, args: ['deactivate',] },],
};
class OutletInjector {
    /**
     * @param {?} route
     * @param {?} childContexts
     * @param {?} parent
     */
    constructor(route, childContexts, parent) {
        this.route = route;
        this.childContexts = childContexts;
        this.parent = parent;
    }
    /**
     * @param {?} token
     * @param {?=} notFoundValue
     * @return {?}
     */
    get(token, notFoundValue) {
        if (token === ActivatedRoute) {
            return this.route;
        }
        if (token === ChildrenOutletContexts) {
            return this.childContexts;
        }
        return this.parent.get(token, notFoundValue);
    }
}

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
class PreloadingStrategy {
}
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
class PreloadAllModules {
    /**
     * @param {?} route
     * @param {?} fn
     * @return {?}
     */
    preload(route, fn) {
        return _catch.call(fn(), () => of(null));
    }
}
/**
 * \@whatItDoes Provides a preloading strategy that does not preload any modules.
 *
 * \@description
 *
 * This strategy is enabled by default.
 *
 * \@experimental
 */
class NoPreloading {
    /**
     * @param {?} route
     * @param {?} fn
     * @return {?}
     */
    preload(route, fn) { return of(null); }
}
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
class RouterPreloader {
    /**
     * @param {?} router
     * @param {?} moduleLoader
     * @param {?} compiler
     * @param {?} injector
     * @param {?} preloadingStrategy
     */
    constructor(router, moduleLoader, compiler, injector, preloadingStrategy) {
        this.router = router;
        this.injector = injector;
        this.preloadingStrategy = preloadingStrategy;
        const /** @type {?} */ onStartLoad = (r) => router.triggerEvent(new RouteConfigLoadStart(r));
        const /** @type {?} */ onEndLoad = (r) => router.triggerEvent(new RouteConfigLoadEnd(r));
        this.loader = new RouterConfigLoader(moduleLoader, compiler, onStartLoad, onEndLoad);
    }
    /**
     * @return {?}
     */
    setUpPreloading() {
        const /** @type {?} */ navigations$ = filter.call(this.router.events, (e) => e instanceof NavigationEnd);
        this.subscription = concatMap.call(navigations$, () => this.preload()).subscribe(() => { });
    }
    /**
     * @return {?}
     */
    preload() {
        const /** @type {?} */ ngModule = this.injector.get(NgModuleRef);
        return this.processRoutes(ngModule, this.router.config);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() { this.subscription.unsubscribe(); }
    /**
     * @param {?} ngModule
     * @param {?} routes
     * @return {?}
     */
    processRoutes(ngModule, routes) {
        const /** @type {?} */ res = [];
        for (const /** @type {?} */ route of routes) {
            // we already have the config loaded, just recurse
            if (route.loadChildren && !route.canLoad && route._loadedConfig) {
                const /** @type {?} */ childConfig = route._loadedConfig;
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
    }
    /**
     * @param {?} ngModule
     * @param {?} route
     * @return {?}
     */
    preloadConfig(ngModule, route) {
        return this.preloadingStrategy.preload(route, () => {
            const /** @type {?} */ loaded$ = this.loader.load(ngModule.injector, route);
            return mergeMap.call(loaded$, (config) => {
                route._loadedConfig = config;
                return this.processRoutes(config.module, config.routes);
            });
        });
    }
}
RouterPreloader.decorators = [
    { type: Injectable },
];
/** @nocollapse */
RouterPreloader.ctorParameters = () => [
    { type: Router, },
    { type: NgModuleFactoryLoader, },
    { type: Compiler, },
    { type: Injector, },
    { type: PreloadingStrategy, },
];

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
const ROUTER_DIRECTIVES = [RouterOutlet, RouterLink, RouterLinkWithHref, RouterLinkActive];
/**
 * \@whatItDoes Is used in DI to configure the router.
 * \@stable
 */
const ROUTER_CONFIGURATION = new InjectionToken('ROUTER_CONFIGURATION');
/**
 * \@docsNotRequired
 */
const ROUTER_FORROOT_GUARD = new InjectionToken('ROUTER_FORROOT_GUARD');
const ROUTER_PROVIDERS = [
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
class RouterModule {
    /**
     * @param {?} guard
     * @param {?} router
     */
    constructor(guard, router) { }
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
    static forRoot(routes, config) {
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
    }
    /**
     * Creates a module with all the router directives and a provider registering routes.
     * @param {?} routes
     * @return {?}
     */
    static forChild(routes) {
        return { ngModule: RouterModule, providers: [provideRoutes(routes)] };
    }
}
RouterModule.decorators = [
    { type: NgModule, args: [{ declarations: ROUTER_DIRECTIVES, exports: ROUTER_DIRECTIVES },] },
];
/** @nocollapse */
RouterModule.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [ROUTER_FORROOT_GUARD,] },] },
    { type: Router, decorators: [{ type: Optional },] },
];
/**
 * @param {?} platformLocationStrategy
 * @param {?} baseHref
 * @param {?=} options
 * @return {?}
 */
function provideLocationStrategy(platformLocationStrategy, baseHref, options = {}) {
    return options.useHash ? new HashLocationStrategy(platformLocationStrategy, baseHref) :
        new PathLocationStrategy(platformLocationStrategy, baseHref);
}
/**
 * @param {?} router
 * @return {?}
 */
function provideForRootGuard(router) {
    if (router) {
        throw new Error(`RouterModule.forRoot() called twice. Lazy loaded modules should use RouterModule.forChild() instead.`);
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
function setupRouter(ref, urlSerializer, contexts, location, injector, loader, compiler, config, opts = {}, urlHandlingStrategy, routeReuseStrategy) {
    const /** @type {?} */ router = new Router(null, urlSerializer, contexts, location, injector, loader, compiler, flatten(config));
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
        const /** @type {?} */ dom = ɵgetDOM();
        router.events.subscribe(e => {
            dom.logGroup(`Router Event: ${((/** @type {?} */ (e.constructor))).name}`);
            dom.log(e.toString());
            dom.log(e);
            dom.logGroupEnd();
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
class RouterInitializer {
    /**
     * @param {?} injector
     */
    constructor(injector) {
        this.injector = injector;
        this.initNavigation = false;
        this.resultOfPreactivationDone = new Subject();
    }
    /**
     * @return {?}
     */
    appInitializer() {
        const /** @type {?} */ p = this.injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
        return p.then(() => {
            let /** @type {?} */ resolve = /** @type {?} */ ((null));
            const /** @type {?} */ res = new Promise(r => resolve = r);
            const /** @type {?} */ router = this.injector.get(Router);
            const /** @type {?} */ opts = this.injector.get(ROUTER_CONFIGURATION);
            if (this.isLegacyDisabled(opts) || this.isLegacyEnabled(opts)) {
                resolve(true);
            }
            else if (opts.initialNavigation === 'disabled') {
                router.setUpLocationChangeListener();
                resolve(true);
            }
            else if (opts.initialNavigation === 'enabled') {
                router.hooks.afterPreactivation = () => {
                    // only the initial navigation should be delayed
                    if (!this.initNavigation) {
                        this.initNavigation = true;
                        resolve(true);
                        return this.resultOfPreactivationDone;
                        // subsequent navigations should not be delayed
                    }
                    else {
                        return /** @type {?} */ (of(null));
                    }
                };
                router.initialNavigation();
            }
            else {
                throw new Error(`Invalid initialNavigation options: '${opts.initialNavigation}'`);
            }
            return res;
        });
    }
    /**
     * @param {?} bootstrappedComponentRef
     * @return {?}
     */
    bootstrapListener(bootstrappedComponentRef) {
        const /** @type {?} */ opts = this.injector.get(ROUTER_CONFIGURATION);
        const /** @type {?} */ preloader = this.injector.get(RouterPreloader);
        const /** @type {?} */ router = this.injector.get(Router);
        const /** @type {?} */ ref = this.injector.get(ApplicationRef);
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
    }
    /**
     * @param {?} opts
     * @return {?}
     */
    isLegacyEnabled(opts) {
        return opts.initialNavigation === 'legacy_enabled' || opts.initialNavigation === true ||
            opts.initialNavigation === undefined;
    }
    /**
     * @param {?} opts
     * @return {?}
     */
    isLegacyDisabled(opts) {
        return opts.initialNavigation === 'legacy_disabled' || opts.initialNavigation === false;
    }
}
RouterInitializer.decorators = [
    { type: Injectable },
];
/** @nocollapse */
RouterInitializer.ctorParameters = () => [
    { type: Injector, },
];
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
const ROUTER_INITIALIZER = new InjectionToken('Router Initializer');
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
const VERSION = new Version('6.0.0-beta.2-8c5c0dac1');

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

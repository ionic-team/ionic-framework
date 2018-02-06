/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Route } from './config';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from './router_state';
/**
 * @whatItDoes Identifies the trigger of the navigation.
 *
 * * 'imperative'--triggered by `router.navigateByUrl` or `router.navigate`.
 * * 'popstate'--triggered by a popstate event
 * * 'hashchange'--triggered by a hashchange event
 *
 * @experimental
 */
export declare type NavigationTrigger = 'imperative' | 'popstate' | 'hashchange';
/**
 * @whatItDoes Base for events the Router goes through, as opposed to events tied to a specific
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
 * @experimental
 */
export declare class RouterEvent {
    /** @docsNotRequired */
    id: number;
    /** @docsNotRequired */
    url: string;
    constructor(
        /** @docsNotRequired */
        id: number, 
        /** @docsNotRequired */
        url: string);
}
/**
 * @whatItDoes Represents an event triggered when a navigation starts.
 *
 * @stable
 */
export declare class NavigationStart extends RouterEvent {
    /**
     * Identifies the trigger of the navigation.
     *
     * * 'imperative'--triggered by `router.navigateByUrl` or `router.navigate`.
     * * 'popstate'--triggered by a popstate event
     * * 'hashchange'--triggered by a hashchange event
     */
    navigationTrigger?: 'imperative' | 'popstate' | 'hashchange';
    /**
     * This contains the navigation id that pushed the history record that the router navigates
     * back to. This is not null only when the navigation is triggered by a popstate event.
     *
     * The router assigns a navigationId to every router transition/navigation. Even when the user
     * clicks on the back button in the browser, a new navigation id will be created. So from
     * the perspective of the router, the router never "goes back". By using the `restoredState`
     * and its navigationId, you can implement behavior that differentiates between creating new
     * states
     * and popstate events. In the latter case you can restore some remembered state (e.g., scroll
     * position).
     */
    restoredState?: {
        navigationId: number;
    } | null;
    constructor(
        /** @docsNotRequired */
        id: number, 
        /** @docsNotRequired */
        url: string, 
        /** @docsNotRequired */
        navigationTrigger?: 'imperative' | 'popstate' | 'hashchange', 
        /** @docsNotRequired */
        restoredState?: {
        navigationId: number;
    } | null);
    /** @docsNotRequired */
    toString(): string;
}
/**
 * @whatItDoes Represents an event triggered when a navigation ends successfully.
 *
 * @stable
 */
export declare class NavigationEnd extends RouterEvent {
    /** @docsNotRequired */
    urlAfterRedirects: string;
    constructor(
        /** @docsNotRequired */
        id: number, 
        /** @docsNotRequired */
        url: string, 
        /** @docsNotRequired */
        urlAfterRedirects: string);
    /** @docsNotRequired */
    toString(): string;
}
/**
 * @whatItDoes Represents an event triggered when a navigation is canceled.
 *
 * @stable
 */
export declare class NavigationCancel extends RouterEvent {
    /** @docsNotRequired */
    reason: string;
    constructor(
        /** @docsNotRequired */
        id: number, 
        /** @docsNotRequired */
        url: string, 
        /** @docsNotRequired */
        reason: string);
    /** @docsNotRequired */
    toString(): string;
}
/**
 * @whatItDoes Represents an event triggered when a navigation fails due to an unexpected error.
 *
 * @stable
 */
export declare class NavigationError extends RouterEvent {
    /** @docsNotRequired */
    error: any;
    constructor(
        /** @docsNotRequired */
        id: number, 
        /** @docsNotRequired */
        url: string, 
        /** @docsNotRequired */
        error: any);
    /** @docsNotRequired */
    toString(): string;
}
/**
 * @whatItDoes Represents an event triggered when routes are recognized.
 *
 * @stable
 */
export declare class RoutesRecognized extends RouterEvent {
    /** @docsNotRequired */
    urlAfterRedirects: string;
    /** @docsNotRequired */
    state: RouterStateSnapshot;
    constructor(
        /** @docsNotRequired */
        id: number, 
        /** @docsNotRequired */
        url: string, 
        /** @docsNotRequired */
        urlAfterRedirects: string, 
        /** @docsNotRequired */
        state: RouterStateSnapshot);
    /** @docsNotRequired */
    toString(): string;
}
/**
 * @whatItDoes Represents the start of the Guard phase of routing.
 *
 * @experimental
 */
export declare class GuardsCheckStart extends RouterEvent {
    /** @docsNotRequired */
    urlAfterRedirects: string;
    /** @docsNotRequired */
    state: RouterStateSnapshot;
    constructor(
        /** @docsNotRequired */
        id: number, 
        /** @docsNotRequired */
        url: string, 
        /** @docsNotRequired */
        urlAfterRedirects: string, 
        /** @docsNotRequired */
        state: RouterStateSnapshot);
    toString(): string;
}
/**
 * @whatItDoes Represents the end of the Guard phase of routing.
 *
 * @experimental
 */
export declare class GuardsCheckEnd extends RouterEvent {
    /** @docsNotRequired */
    urlAfterRedirects: string;
    /** @docsNotRequired */
    state: RouterStateSnapshot;
    /** @docsNotRequired */
    shouldActivate: boolean;
    constructor(
        /** @docsNotRequired */
        id: number, 
        /** @docsNotRequired */
        url: string, 
        /** @docsNotRequired */
        urlAfterRedirects: string, 
        /** @docsNotRequired */
        state: RouterStateSnapshot, 
        /** @docsNotRequired */
        shouldActivate: boolean);
    toString(): string;
}
/**
 * @whatItDoes Represents the start of the Resolve phase of routing. The timing of this
 * event may change, thus it's experimental. In the current iteration it will run
 * in the "resolve" phase whether there's things to resolve or not. In the future this
 * behavior may change to only run when there are things to be resolved.
 *
 * @experimental
 */
export declare class ResolveStart extends RouterEvent {
    /** @docsNotRequired */
    urlAfterRedirects: string;
    /** @docsNotRequired */
    state: RouterStateSnapshot;
    constructor(
        /** @docsNotRequired */
        id: number, 
        /** @docsNotRequired */
        url: string, 
        /** @docsNotRequired */
        urlAfterRedirects: string, 
        /** @docsNotRequired */
        state: RouterStateSnapshot);
    toString(): string;
}
/**
 * @whatItDoes Represents the end of the Resolve phase of routing. See note on
 * {@link ResolveStart} for use of this experimental API.
 *
 * @experimental
 */
export declare class ResolveEnd extends RouterEvent {
    /** @docsNotRequired */
    urlAfterRedirects: string;
    /** @docsNotRequired */
    state: RouterStateSnapshot;
    constructor(
        /** @docsNotRequired */
        id: number, 
        /** @docsNotRequired */
        url: string, 
        /** @docsNotRequired */
        urlAfterRedirects: string, 
        /** @docsNotRequired */
        state: RouterStateSnapshot);
    toString(): string;
}
/**
 * @whatItDoes Represents an event triggered before lazy loading a route config.
 *
 * @experimental
 */
export declare class RouteConfigLoadStart {
    /** @docsNotRequired */
    route: Route;
    constructor(
        /** @docsNotRequired */
        route: Route);
    toString(): string;
}
/**
 * @whatItDoes Represents an event triggered when a route has been lazy loaded.
 *
 * @experimental
 */
export declare class RouteConfigLoadEnd {
    /** @docsNotRequired */
    route: Route;
    constructor(
        /** @docsNotRequired */
        route: Route);
    toString(): string;
}
/**
 * @whatItDoes Represents the start of end of the Resolve phase of routing. See note on
 * {@link ChildActivationEnd} for use of this experimental API.
 *
 * @experimental
 */
export declare class ChildActivationStart {
    /** @docsNotRequired */
    snapshot: ActivatedRouteSnapshot;
    constructor(
        /** @docsNotRequired */
        snapshot: ActivatedRouteSnapshot);
    toString(): string;
}
/**
 * @whatItDoes Represents the start of end of the Resolve phase of routing. See note on
 * {@link ChildActivationStart} for use of this experimental API.
 *
 * @experimental
 */
export declare class ChildActivationEnd {
    /** @docsNotRequired */
    snapshot: ActivatedRouteSnapshot;
    constructor(
        /** @docsNotRequired */
        snapshot: ActivatedRouteSnapshot);
    toString(): string;
}
/**
 * @whatItDoes Represents the start of end of the Resolve phase of routing. See note on
 * {@link ActivationEnd} for use of this experimental API.
 *
 * @experimental
 */
export declare class ActivationStart {
    /** @docsNotRequired */
    snapshot: ActivatedRouteSnapshot;
    constructor(
        /** @docsNotRequired */
        snapshot: ActivatedRouteSnapshot);
    toString(): string;
}
/**
 * @whatItDoes Represents the start of end of the Resolve phase of routing. See note on
 * {@link ActivationStart} for use of this experimental API.
 *
 * @experimental
 */
export declare class ActivationEnd {
    /** @docsNotRequired */
    snapshot: ActivatedRouteSnapshot;
    constructor(
        /** @docsNotRequired */
        snapshot: ActivatedRouteSnapshot);
    toString(): string;
}
/**
 * @whatItDoes Represents a router event, allowing you to track the lifecycle of the router.
 *
 * The sequence of router events is:
 *
 * - {@link NavigationStart},
 * - {@link RouteConfigLoadStart},
 * - {@link RouteConfigLoadEnd},
 * - {@link RoutesRecognized},
 * - {@link GuardsCheckStart},
 * - {@link ChildActivationStart},
 * - {@link ActivationStart},
 * - {@link GuardsCheckEnd},
 * - {@link ResolveStart},
 * - {@link ResolveEnd},
 * - {@link ActivationEnd}
 * - {@link ChildActivationEnd}
 * - {@link NavigationEnd},
 * - {@link NavigationCancel},
 * - {@link NavigationError}
 *
 * @stable
 */
export declare type Event = RouterEvent | RouteConfigLoadStart | RouteConfigLoadEnd | ChildActivationStart | ChildActivationEnd | ActivationStart | ActivationEnd;

import { ActivatedRouteSnapshot } from './router_state';
/**
 * @whatItDoes Represents the detached route tree.
 *
 * This is an opaque value the router will give to a custom route reuse strategy
 * to store and retrieve later on.
 *
 * @experimental
 */
export declare type DetachedRouteHandle = {};
/**
 * @whatItDoes Provides a way to customize when activated routes get reused.
 *
 * @experimental
 */
export declare abstract class RouteReuseStrategy {
    /** Determines if this route (and its subtree) should be detached to be reused later */
    abstract shouldDetach(route: ActivatedRouteSnapshot): boolean;
    /**
     * Stores the detached route.
     *
     * Storing a `null` value should erase the previously stored value.
     */
    abstract store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void;
    /** Determines if this route (and its subtree) should be reattached */
    abstract shouldAttach(route: ActivatedRouteSnapshot): boolean;
    /** Retrieves the previously stored route */
    abstract retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null;
    /** Determines if a route should be reused */
    abstract shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean;
}
/**
 * Does not detach any subtrees. Reuses routes as long as their route config is the same.
 */
export declare class DefaultRouteReuseStrategy implements RouteReuseStrategy {
    shouldDetach(route: ActivatedRouteSnapshot): boolean;
    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void;
    shouldAttach(route: ActivatedRouteSnapshot): boolean;
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null;
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean;
}

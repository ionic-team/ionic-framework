/**
 * Provides a way to customize when activated routes get reused.
 */
export class IonicRouteStrategy {
    /**
     * Whether the given route should detach for later reuse.
     */
    shouldDetach(_route) {
        return false;
    }
    /**
     * Returns `false`, meaning the route (and its subtree) is never reattached
     */
    shouldAttach(_route) {
        return false;
    }
    /**
     * A no-op; the route is never stored since this strategy never detaches routes for later re-use.
     */
    store(_route, _detachedTree) {
        return;
    }
    /**
     * Returns `null` because this strategy does not store routes for later re-use.
     */
    retrieve(_route) {
        return null;
    }
    /**
     * Determines if a route should be reused.
     * This strategy returns `true` when the future route config and
     * current route config are identical and all route parameters are identical.
     */
    shouldReuseRoute(future, curr) {
        if (future.routeConfig !== curr.routeConfig) {
            return false;
        }
        // checking router params
        const futureParams = future.params;
        const currentParams = curr.params;
        const keysA = Object.keys(futureParams);
        const keysB = Object.keys(currentParams);
        if (keysA.length !== keysB.length) {
            return false;
        }
        // Test for A's keys different from B.
        for (const key of keysA) {
            if (currentParams[key] !== futureParams[key]) {
                return false;
            }
        }
        return true;
    }
}

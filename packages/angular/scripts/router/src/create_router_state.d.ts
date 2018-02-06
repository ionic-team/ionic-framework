import { RouteReuseStrategy } from './route_reuse_strategy';
import { RouterState, RouterStateSnapshot } from './router_state';
export declare function createRouterState(routeReuseStrategy: RouteReuseStrategy, curr: RouterStateSnapshot, prevState: RouterState): RouterState;

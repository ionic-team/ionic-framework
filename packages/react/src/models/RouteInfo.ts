
import { RouteAction } from './IonRouteAction';
import { RouterDirection } from './RouterDirection';

export interface RouteInfo<TOptions = any> {
  id: string;
  lastPathname?: string;
  routeAction?: RouteAction;
  routeDirection?: RouterDirection;
  routeOptions?: TOptions;
  params?: {[key: string]: string | string[]};
  pushedByRoute?: string;
  pathname: string;
  search: string;
  tab?: string;
}

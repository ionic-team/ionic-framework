import { RouterDirection } from '../../components/hrefprops';

import { RouteAction } from './IonRouteAction';

export interface RouteInfo {
  currentRoute: string;
  lastRoute?: string;
  routeAction?: RouteAction;
  routeDirection?: RouterDirection;
  routeOptions?: any;
  params?: {[key: string]: string | string[]};
  pushedByRoute?: string;
  pathname: string;
  search: string;
  tab?: string;
}

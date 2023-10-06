import type { AnimationBuilder } from '@ionic/core/components';

import type { RouteAction } from './RouteAction';
import type { RouterDirection } from './RouterDirection';

export interface RouteInfo<TOptions = any> {
  id: string;
  lastPathname?: string;
  prevRouteLastPathname?: string;
  routeAction?: RouteAction;
  // In Ionic Vue this is called routerDirection
  // TODO we should align the naming
  routeDirection?: RouterDirection;
  // In Ionic Vue this is called routerAnimation
  // TODO we should align the naming
  routeAnimation?: AnimationBuilder;
  routeOptions?: TOptions;
  params?: { [key: string]: string | string[] };
  pushedByRoute?: string;
  pathname: string;
  search: string;
  tab?: string;
  delta?: number;
}

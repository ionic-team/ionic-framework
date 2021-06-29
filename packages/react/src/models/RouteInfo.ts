import { AnimationBuilder } from '@ionic/core';

import { RouteAction } from './RouteAction';
import { RouterDirection } from './RouterDirection';

export interface RouteInfo<TOptions = any> {
  id: string;
  lastPathname?: string;
  prevRouteLastPathname?: string;
  routeAction?: RouteAction;
  routeDirection?: RouterDirection;
  routeAnimation?: AnimationBuilder;
  routeOptions?: TOptions;
  params?: { [key: string]: string | string[] };
  pushedByRoute?: string;
  pathname: string;
  search: string;
  tab?: string;
}

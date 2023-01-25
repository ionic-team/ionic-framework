import type { AnimationBuilder } from '@ionic/core/components';

import type { RouteAction } from './RouteAction';
import type { RouterDirection } from './RouterDirection';

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

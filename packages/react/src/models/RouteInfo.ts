
import { RouteAction } from './IonRouteAction';
import { RouterDirection } from './RouterDirection';
import { AnimationBuilder } from '@ionic/core';

export interface RouteInfo<TOptions = any> {
  id: string;
  lastPathname?: string;
  routeAction?: RouteAction;
  routeDirection?: RouterDirection;
  routeAnimation?: AnimationBuilder;
  routeOptions?: TOptions;
  params?: {[key: string]: string | string[]};
  pushedByRoute?: string;
  pathname: string;
  search: string;
  tab?: string;
}

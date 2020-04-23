import { RouteInfo } from '@ionic/react';

export interface NextRouteOptions {
  routePath?: string;
  lastRoutePath?: string;
  as?: string;
}

export interface NextRouteInfo extends RouteInfo<NextRouteOptions> { }

import { AnimationBuilder } from '@ionic/core';

export interface RouteInfo {
  id: string;
  routeAction?: RouteAction;
  routeDirection?: RouteDirection;
  lastPathname?: string;
  pathname: string;
  search: string;
  params?: { [k: string]: any };
}

export interface RouteParams {
  routeAction: RouteAction;
  routeDirection: RouteDirection;
}

export type RouteAction = 'push' | 'pop' | 'replace';
export type RouteDirection = 'forward' | 'back' | 'root';
export type TransitionCallback = (routeInfo: RouteInfo) => void;

export interface ViewItem {
  id: string;
  pathname: string;
  outletId: number;
  matchedRoute: any; // todo
  ionPageElement?: HTMLElement;
  vueComponent: any; // todo
  ionRoute: boolean;
}

export interface ViewStacks {
  [k: string]: ViewItem[];
}

export interface ExternalNavigationOptions {
  path: string;
  direction?: RouteDirection;
  animation?: AnimationBuilder;
  event: Event;
}

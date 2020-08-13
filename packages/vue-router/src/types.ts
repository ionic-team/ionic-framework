import { AnimationBuilder } from '@ionic/core';
import { RouterOptions } from 'vue-router';

export interface IonicVueRouterOptions extends RouterOptions {
  tabsPrefix?: string;
}

export interface RouteInfo {
  id?: string;
  routerAction?: RouteAction;
  routerDirection?: RouteDirection;
  routerAnimation?: AnimationBuilder;
  lastPathname?: string;
  pathname?: string;
  search?: string;
  params?: { [k: string]: any };
  tab?: string;
  previousTab?: string;
  tabSwitch?: boolean;
}

export interface RouteParams {
  routerAction: RouteAction;
  routerDirection: RouteDirection;
  routerAnimation?: AnimationBuilder;
}

export type RouteAction = 'push' | 'pop' | 'replace';
export type RouteDirection = 'forward' | 'back' | 'root' | 'none';

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
  routerLink: string;
  routerDirection?: RouteDirection;
  routerAnimation?: AnimationBuilder;
}

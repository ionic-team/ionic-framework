import { AnimationBuilder } from '@ionic/core';
import { RouteLocationMatched, RouterOptions } from 'vue-router';
import { Ref } from 'vue';

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
  pushedByRoute?: string;
  tab?: string;
}

export interface RouteParams {
  routerAction: RouteAction;
  routerDirection: RouteDirection;
  routerAnimation?: AnimationBuilder;
  tab?: string;
  id?: string;
}

export type RouteAction = 'push' | 'pop' | 'replace';
export type RouteDirection = 'forward' | 'back' | 'root' | 'none';

export interface ViewItem {
  id: string;
  pathname: string;
  outletId: number;
  matchedRoute: RouteLocationMatched;
  ionPageElement?: HTMLElement;
  vueComponent: any; // todo
  ionRoute: boolean;
  mount: boolean;
  exact: boolean;
  registerCallback?: () => void;
  vueComponentRef: Ref;
}

export interface ViewStacks {
  [k: string]: ViewItem[];
}

export interface ExternalNavigationOptions {
  routerLink: string;
  routerDirection?: RouteDirection;
  routerAnimation?: AnimationBuilder;
}

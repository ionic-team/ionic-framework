import { AnimationBuilder } from '@ionic/vue';
import { RouteLocationMatched, RouterOptions } from 'vue-router';
import { Ref } from 'vue';

export interface VueComponentData {
  /**
   * The cached result of the props
   * function for a particular view instance.
   */
  propsFunctionResult?: any;
}

export interface IonicVueRouterOptions extends RouterOptions {
  tabsPrefix?: string;
}

export interface RouteInfo {
  id?: string;
  routerAction?: RouteAction;
  routerDirection?: RouteDirection;
  routerAnimation?: AnimationBuilder;
  /**
   * The pathname of the last route, used to handle transitions
   */
  lastPathname?: string;
  /**
   * The pathname of the current route
   */
  pathname?: string;
  search?: string;
  params?: { [k: string]: any };
  /**
   * Which route name push this route
   */
  pushedByRoute?: string;
  /**
   * When a Route is replaced by a previous route, store that pathname here to demount/transition away from the replaced route
   */
  replacedRoute?: string;
  tab?: string;
  position?: number;
  delta?: number;
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
  params?: { [k: string]: any };
  vueComponentData: VueComponentData;
}

//@TODO: Define types of ViewStacks
export interface ViewStacks {
  [k: string]: ViewItem[];
}

export interface ExternalNavigationOptions {
  routerLink: string;
  routerDirection?: RouteDirection;
  routerAnimation?: AnimationBuilder;
}

export interface NavigationInformation {
  action?: RouteAction;
  direction?: RouteDirection;
  delta?: number;
}

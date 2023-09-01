import type { AnimationBuilder } from "@ionic/vue";
import type { Ref } from "vue";
import type { RouteLocationMatched, RouterOptions } from "vue-router";

// TODO(FW-2969): types

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
   * The previous route you were on if you were to
   * navigate backwards in a linear manner.
   * i.e. If you pressed the browser back button,
   * this is the route you would land on.
   */
  lastPathname?: string;
  prevRouteLastPathname?: string;
  pathname?: string;
  search?: string;
  params?: { [k: string]: any };

  /**
   * The route that pushed the current route.
   * This is used to determine if a route can swipe
   * to go back to a previous route. This is
   * usually the same as lastPathname when navigating
   * in a linear manner but is almost always different
   * when using tabs.
   */
  pushedByRoute?: string;
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

export type RouteAction = "push" | "pop" | "replace";
export type RouteDirection = "forward" | "back" | "root" | "none";

export interface ViewItem {
  id: string;
  pathname: string;
  outletId: number;
  matchedRoute: RouteLocationMatched;
  ionPageElement?: HTMLElement;
  vueComponent: any;
  ionRoute: boolean;
  mount: boolean;
  exact: boolean;
  registerCallback?: () => void;
  vueComponentRef: Ref;
  params?: { [k: string]: any };
  vueComponentData: VueComponentData;
  routerAnimation?: AnimationBuilder;
}

export interface ViewStacks {
  [k: string]: ViewItem[];
}

export interface ExternalNavigationOptions {
  routerLink: string;
  routerDirection?: RouteDirection;
  routerAnimation?: AnimationBuilder;
  routerAction?: RouteAction;
}

export interface NavigationInformation {
  action?: RouteAction;
  direction?: RouteDirection;
  delta?: number;
}

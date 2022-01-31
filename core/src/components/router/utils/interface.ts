import { AnimationBuilder, ComponentProps } from '../../../interface';
import { NavigationHookCallback } from '../../route/route-interface';

export interface HTMLStencilElement extends HTMLElement {
  componentOnReady(): Promise<this>;
}

export interface NavOutlet {
  setRouteId(id: string, params: ComponentProps | undefined, direction: RouterDirection, animation?: AnimationBuilder): Promise<RouteWrite>;
  getRouteId(): Promise<RouteID | undefined>;
}

export interface RouterEventDetail {
  from: string | null;
  redirectedFrom: string | null;
  to: string;
}

export interface RouterCustomEvent extends CustomEvent {
  detail: RouterEventDetail;
  target: HTMLIonRouterElement;
}

export interface RouteRedirect {
  from: string[];
  to?: ParsedRoute;
}

export interface RouteWrite {
  changed: boolean;
  element: HTMLElement | undefined;
  markVisible?: () => void | Promise<void>;
}

export interface RouteID {
  id: string;
  element: HTMLElement | undefined;
  params?: {[key: string]: any};
}

export interface RouteNode {
  /** Component tag name or tab name. */
  id: string;
  segments: string[];
  /**
   * The route parameters.
   *
   * They are the initialized from the `componentProps` property of the `<ion-route>`.
   * They do not include any URL parameters (i.e. `/:param` segments).
   */
  params: {[key: string]: any} | undefined;
  beforeLeave?: NavigationHookCallback;
  beforeEnter?: NavigationHookCallback;
  children: RouteTree;
}

export interface ResolvedRouteNode {
  node: RouteNode,
  /** Merged route and URL parameters */
  params: {[key: string]: any} | undefined,
}

export interface ParsedRoute {
  /** Parts of the route (non empty "/" separated parts of an URL). */
  segments: string[];
  /** Unparsed query string. */
  queryString?: string;
}

export type RouterDirection = 'forward' | 'back' | 'root';
export type NavOutletElement = NavOutlet & HTMLStencilElement;

/** A RouteChain is a branch in the tree (from a root node to a terminal node) */
export type RouteChain = RouteNode[];

/** A chain with the parameters resolved from an URL */
export type ResolvedRouteChain = ResolvedRouteNode[];

export type RouteTree = RouteNode[];

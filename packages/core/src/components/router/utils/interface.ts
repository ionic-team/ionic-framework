import type { AnimationBuilder, ComponentProps } from '../../../interface';
import type { NavigationHookCallback } from '../../route/route-interface';

export interface HTMLStencilElement extends HTMLElement {
  componentOnReady(): Promise<this>;
}

export interface NavOutlet {
  setRouteId(
    id: string,
    params: ComponentProps | undefined,
    direction: RouterDirection,
    animation?: AnimationBuilder
  ): Promise<RouteWrite>;
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
  params?: { [key: string]: any };
}

export interface RouteEntry {
  /** Component tag name or tab name. */
  id: string;
  segments: string[];
  params: { [key: string]: any } | undefined;
  beforeLeave?: NavigationHookCallback;
  beforeEnter?: NavigationHookCallback;
}

export interface RouteNode extends RouteEntry {
  children: RouteTree;
}

export interface ParsedRoute {
  /** Parts of the route (non empty "/" separated parts of an URL). */
  segments: string[];
  /** Unparsed query string. */
  queryString?: string;
}

export type RouterDirection = 'forward' | 'back' | 'root';
export type NavOutletElement = NavOutlet & HTMLStencilElement;
export type RouteChain = RouteEntry[];
export type RouteTree = RouteNode[];

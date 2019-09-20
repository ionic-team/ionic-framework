import { ComponentProps } from '../../../interface';

export interface HTMLStencilElement extends HTMLElement {
  componentOnReady(): Promise<this>;
  forceUpdate(): void;
}

export interface NavOutlet {
  setRouteId(id: string, params: ComponentProps | undefined, direction: RouterDirection): Promise<RouteWrite>;
  getRouteId(): Promise<RouteID | undefined>;
}

export interface RouterEventDetail {
  from: string | null;
  redirectedFrom: string | null;
  to: string;
}

export interface RouteRedirect {
  from: string[];
  to?: string[];
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

export interface RouteEntry {
  id: string;
  path: string[];
  params: {[key: string]: any} | undefined;
}

export interface RouteNode extends RouteEntry {
  children: RouteTree;
}

export type RouterDirection = 'forward' | 'back' | 'root';
export type NavOutletElement = NavOutlet & HTMLStencilElement;
export type RouteChain = RouteEntry[];
export type RouteTree = RouteNode[];

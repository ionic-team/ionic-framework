
export interface NavOutlet {
  setRouteId(id: string, data: any, direction: number): Promise<RouteWrite>;
  getRouteId(): RouteID|undefined;
}

export interface RouterEventDetail {
  from: string|null;
  redirectedFrom: string|null;
  to: string;
}

export const enum RouterDirection {
  None = 0,
  Forward = 1,
  Back = -1,
}

export interface RouteRedirect {
  from: string[];
  to: string[]|undefined;
}

export interface RouteWrite {
  changed: boolean;
  element: HTMLElement | undefined;
  markVisible?: () => void|Promise<void>;
}

export interface RouteID {
  id: string;
  element: HTMLElement|undefined;
  params?: any;
}

export type NavOutletElement = NavOutlet & HTMLStencilElement;

export interface RouteEntry {
  id: string;
  path: string[];
  params: any|undefined;
}

export interface RouteNode extends RouteEntry {
  children: RouteTree;
}

export type RouteChain = RouteEntry[];
export type RouteTree = RouteNode[];

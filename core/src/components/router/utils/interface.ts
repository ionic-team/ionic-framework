
export interface NavOutlet {
  setRouteId(id: string, data: any, direction: number): Promise<RouteWrite>;
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
  params?: any;
}

export interface RouteEntry {
  id: string;
  path: string[];
  params: any | undefined;
}

export interface RouteNode extends RouteEntry {
  children: RouteTree;
}

export type RouterDirection = 'forward' | 'back' | 'root';
export type NavOutletElement = NavOutlet & HTMLStencilElement;
export type RouteChain = RouteEntry[];
export type RouteTree = RouteNode[];

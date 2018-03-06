
export interface NavOutlet {
  setRouteId(id: any, data: any, direction: number): Promise<boolean>;
  getRouteId(): string;
  getContentElement(): HTMLElement | null;
}

export interface RouteMatch {
  chain: RouteChain;
  matches: number;
}

export type NavOutletElement = NavOutlet & HTMLStencilElement;

export interface RouteEntry {
  id: string;
  path: string[];
  props: any|undefined;
}

export interface RouteNode extends RouteEntry {
  children: RouteTree;
}

export type RouteChain = RouteEntry[];
export type RouteTree = RouteNode[];

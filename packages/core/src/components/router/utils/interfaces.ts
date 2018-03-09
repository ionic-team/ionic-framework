
export interface NavOutlet {
  setRouteId(id: string, data: any, direction: number): Promise<RouteWrite>;
  getRouteId(): RouteID|null;

  getContainerEl(): HTMLElement | null;
}

export interface RouteWrite {
  changed: boolean;
  markVisible?: () => void|Promise<void>;
}

export interface RouteID {
  id: string;
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

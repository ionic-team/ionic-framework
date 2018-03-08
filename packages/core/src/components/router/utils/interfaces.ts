
export interface NavOutlet {
  setRouteId(id: string, data: any, direction: number): Promise<boolean>;
  markVisible?(): Promise<void>;
  getRouteId(): RouteID|null;

  getContainerEl(): HTMLElement | null;
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

import { StencilElement } from '../../index';

export interface NavOutlet {
  setRouteId(id: any, data?: any): Promise<void>;
  getRouteId(): string;
  getContentElement(): HTMLElement | null;
}

export type NavOutletElement = NavOutlet & StencilElement;

export interface RouterEntry {
  id: any;
  path: string[];
  subroutes: RouterEntries;
  props?: any;
}

export type RouterEntries = RouterEntry[];

export class RouterSegments {
  constructor(
    private path: string[]
  ) {}

  next(): string {
    if (this.path.length > 0) {
      return this.path.shift() as string;
    }
    return '';
  }
}

export function writeNavState(root: HTMLElement, chain: RouterEntries, index = 0): Promise<void> {
  if (index >= chain.length) {
    return Promise.resolve();
  }

  const route = chain[index];
  const node = breadthFirstSearch(root);
  if (!node) {
    return Promise.resolve();
  }
  return node.componentOnReady()
    .then(() => node.setRouteId(route.id, route.props))
    .then(() => {
      const nextEl = node.getContentElement();
      if (nextEl) {
        return writeNavState(nextEl, chain, index + 1);
      }
      return null;
    });
}

export function readNavState(node: HTMLElement) {
  const stack: string[] = [];
  let pivot: NavOutlet|null;
  while (true) {
    pivot = breadthFirstSearch(node);
    if (pivot) {
      const cmp = pivot.getRouteId();
      if (cmp) {
        node = pivot.getContentElement();
        stack.push(cmp.toLowerCase());
      } else {
        break;
      }
    } else {
      break;
    }
  }
  return {
    stack: stack,
    pivot: pivot,
  };
}

export function matchPath(stack: string[], routes: RouterEntries) {
  const path: string[] = [];
  for (const id of stack) {
    const route = routes.find(r => r.id === id);
    if (route) {
      path.push(...route.path);
      routes = route.subroutes;
    } else {
      break;
    }
  }
  return {
    path: path,
    routes: routes,
  };
}

export function matchRouteChain(path: string[], routes: RouterEntries): RouterEntries {
  const chain = [];
  const segments = new RouterSegments(path);
  while (routes.length > 0) {
    const route = matchRoute(segments, routes);
    if (!route) {
      break;
    }
    chain.push(route);
    routes = route.subroutes;
  }
  return chain;
}

export function matchRoute(segments: RouterSegments, routes: RouterEntries): RouterEntry | null {
  if (!routes) {
    return null;
  }
  let index = 0;
  let selectedRoute: RouterEntry|null = null;
  let ambiguous = false;
  let segment: string;
  let l: number;

  while (true) {
    routes = routes.filter(r => r.path.length > index);
    if (routes.length === 0) {
      break;
    }
    segment = segments.next();
    routes = routes.filter(r => r.path[index] === segment);
    l = routes.length;
    if (l === 0) {
      selectedRoute = null;
      ambiguous = false;
    } else {
      selectedRoute = routes[0];
      ambiguous = l > 1;
    }
    index++;
  }
  if (ambiguous) {
    throw new Error('ambiguious match');
  }
  return selectedRoute;
}

export function readRoutes(root: Element): RouterEntries {
  return (Array.from(root.children) as HTMLIonRouteElement[])
    .filter(el => el.tagName === 'ION-ROUTE')
    .map(el => ({
      path: parsePath(el.path),
      id: el.sel,
      props: el.props,
      subroutes: readRoutes(el)
    }));
}

export function generatePath(segments: string[]): string {
  const path = segments
    .filter(s => s.length > 0)
    .join('/');

  return '/' + path;
}

export function parsePath(path: string): string[] {
  if (path === null || path === undefined) {
    return [''];
  }
  const segments = path.split('/')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (segments.length === 0) {
    return [''];
  } else {
    return segments;
  }
}

const navs = ['ION-NAV', 'ION-TABS'];
export function breadthFirstSearch(root: HTMLElement): NavOutletElement | null {
  if (!root) {
    console.error('search root is null');
    return null;
  }
  // we do a Breadth-first search
  // Breadth-first search (BFS) is an algorithm for traversing or searching tree
  // or graph data structures.It starts at the tree root(or some arbitrary node of a graph,
  // sometimes referred to as a 'search key'[1]) and explores the neighbor nodes
  // first, before moving to the next level neighbours.

  const queue = [root];
  let node: HTMLElement | undefined;
  while (node = queue.shift()) {
    // visit node
    if (navs.indexOf(node.tagName) >= 0) {
      return node as NavOutletElement;
    }

    // queue children
    const children = node.children;
    for (let i = 0; i < children.length; i++) {
      queue.push(children[i] as NavOutletElement);
    }
  }
  return null;
}

export function writePath(history: History, base: string, usePath: boolean, path: string[], isPop: boolean) {
  path = [base, ...path];
  let url = generatePath(path);
  if (usePath) {
    url = '#' + url;
  }
  if (isPop) {
    history.back();
    history.replaceState(null, null, url);
  } else {
    history.pushState(null, null, url);
  }
}

export function readPath(loc: Location, base: string, useHash: boolean): string[] | null {
  const path = useHash
    ? loc.hash.substr(1)
    : loc.pathname;

  if (path.startsWith(base)) {
    return parsePath(path.slice(base.length));
  }
  return null;
}

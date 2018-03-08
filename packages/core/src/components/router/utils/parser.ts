import { RouteChain, RouteNode, RouteTree } from './interfaces';
import { parsePath } from './path';


export function readRoutes(root: Element): RouteTree {
  return (Array.from(root.children) as HTMLIonRouteElement[])
    .filter(el => el.tagName === 'ION-ROUTE')
    .map(el => ({
      path: parsePath(readProp(el, 'path')),
      id: readProp(el, 'component').toLowerCase(),
      params: el.params,
      children: readRoutes(el)
    }));
}

export function readProp(el: HTMLElement, prop: string): string|undefined {
  if (prop in el) {
    return (el as any)[prop];
  }
  if (el.hasAttribute(prop)) {
    return el.getAttribute(prop);
  }
  return undefined;
}

export function flattenRouterTree(nodes: RouteTree): RouteChain[] {
  const routes: RouteChain[] = [];
  for (const node of nodes) {
    flattenNode([], routes, node);
  }
  return routes;
}

function flattenNode(chain: RouteChain, routes: RouteChain[], node: RouteNode) {
  const s = chain.slice();
  s.push({
    id: node.id,
    path: node.path,
    params: node.params
  });

  if (node.children.length === 0) {
    routes.push(s);
    return;
  }
  for (const sub of node.children) {
    flattenNode(s, routes, sub);
  }
}

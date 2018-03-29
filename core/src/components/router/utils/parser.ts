import { RouteChain, RouteNode, RouteRedirect, RouteTree } from './interfaces';
import { parsePath } from './path';


export function readRedirects(root: Element): RouteRedirect[] {
  return (Array.from(root.children) as HTMLIonRouteRedirectElement[])
    .filter(el => el.tagName === 'ION-ROUTE-REDIRECT')
    .map(el => {
      const to = readProp(el, 'to');
      return {
        from: parsePath(readProp(el, 'from')),
        to: to == null ? undefined : parsePath(to),
      };
    });
}

export function readRoutes(root: Element, node = root): RouteTree {
  return (Array.from(node.children) as HTMLIonRouteElement[])
    .filter(el => el.tagName === 'ION-ROUTE' && el.component)
    .map(el => {
      return {
        path: parsePath(readProp(el, 'url')),
        id: readProp(el, 'component').toLowerCase(),
        params: el.componentProps,
        children: readRoutes(root, el)
      };
    });
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

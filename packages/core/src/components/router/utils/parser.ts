import { RouteChain, RouteNode, RouteRedirect, RouteTree } from './interfaces';
import { parsePath } from './path';


export function readRedirects(root: Element): RouteRedirect[] {
  return (Array.from(root.children) as HTMLIonRouteElement[])
  .filter(el => el.tagName === 'ION-ROUTE' && el.redirectTo)
  .map(el => {
    if (el.component) {
      throw new Error('Can\'t mix the component and redirectTo attribute in the same ion-route');
    }
    return {
      path: parsePath(readProp(el, 'path')),
      to: parsePath(readProp(el, 'redirectTo'))
    };
  });
}

export function readRoutes(root: Element): RouteTree {
  return (Array.from(root.children) as HTMLIonRouteElement[])
    .filter(el => el.tagName === 'ION-ROUTE' && el.component)
    .map(el => {
      const path = parsePath(readProp(el, 'path'));
      if (path.includes(':id')) {
        console.warn('Using ":id" is not recommended in `ion-route`, it causes conflicts in the DOM');
      }
      return {
        path: path,
        id: readProp(el, 'component').toLowerCase(),
        params: el.params,
        children: readRoutes(el)
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

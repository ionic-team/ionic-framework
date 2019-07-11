import { RouteChain, RouteNode, RouteRedirect, RouteTree } from './interface';
import { parsePath } from './path';

export const readRedirects = (root: Element): RouteRedirect[] => {
  return (Array.from(root.children) as HTMLIonRouteRedirectElement[])
    .filter(el => el.tagName === 'ION-ROUTE-REDIRECT')
    .map(el => {
      const to = readProp(el, 'to');
      return {
        from: parsePath(readProp(el, 'from')),
        to: to == null ? undefined : parsePath(to),
      };
    });
};

export const readRoutes = (root: Element): RouteChain[] => {
  return flattenRouterTree(readRouteNodes(root));
};

export const readRouteNodes = (root: Element, node = root): RouteTree => {
  return (Array.from(node.children) as HTMLIonRouteElement[])
    .filter(el => el.tagName === 'ION-ROUTE' && el.component)
    .map(el => {
      const component = readProp(el, 'component');
      if (component == null) {
        throw new Error('component missing in ion-route');
      }
      return {
        path: parsePath(readProp(el, 'url')),
        id: component.toLowerCase(),
        params: el.componentProps,
        children: readRouteNodes(root, el)
      };
    });
};

export const readProp = (el: HTMLElement, prop: string): string | null | undefined => {
  if (prop in el) {
    return (el as any)[prop];
  }
  if (el.hasAttribute(prop)) {
    return el.getAttribute(prop);
  }
  return null;
};

export const flattenRouterTree = (nodes: RouteTree): RouteChain[] => {
  const routes: RouteChain[] = [];
  for (const node of nodes) {
    flattenNode([], routes, node);
  }
  return routes;
};

const flattenNode = (chain: RouteChain, routes: RouteChain[], node: RouteNode) => {
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
};

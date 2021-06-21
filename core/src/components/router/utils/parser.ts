import { RouteChain, RouteNode, RouteRedirect, RouteTree } from './interface';
import { parsePath } from './path';

const readProp = (el: HTMLElement, prop: string): string | null | undefined => {
  if (prop in el) {
    return (el as any)[prop];
  }
  if (el.hasAttribute(prop)) {
    return el.getAttribute(prop);
  }
  return null;
};

export const readRedirects = (root: Element): RouteRedirect[] => {
  return (Array.from(root.children) as HTMLIonRouteRedirectElement[])
    .filter(el => el.tagName === 'ION-ROUTE-REDIRECT')
    .map(el => {
      const to = readProp(el, 'to');
      return {
        from: parsePath(readProp(el, 'from')).segments,
        to: to == null ? undefined : parsePath(to),
      };
    });
};

export const readRoutes = (root: Element): RouteChain[] => {
  return flattenRouterTree(readRouteNodes(root));
};

export const readRouteNodes = (node: Element): RouteTree => {
  return (Array.from(node.children) as HTMLIonRouteElement[])
    .filter(el => el.tagName === 'ION-ROUTE' && el.component)
    .map(el => {
      const component = readProp(el, 'component') as string;
      return {
        path: parsePath(readProp(el, 'url')).segments,
        id: component.toLowerCase(),
        params: el.componentProps,
        beforeLeave: el.beforeLeave,
        beforeEnter: el.beforeEnter,
        children: readRouteNodes(el)
      };
    });
};

export const flattenRouterTree = (nodes: RouteTree): RouteChain[] => {
  const chains: RouteChain[] = [];
  for (const node of nodes) {
    flattenNode([], chains, node);
  }
  return chains;
};

const flattenNode = (chain: RouteChain, chains: RouteChain[], node: RouteNode) => {
  chain = chain.slice();
  chain.push({
    id: node.id,
    path: node.path,
    params: node.params,
    beforeLeave: node.beforeLeave,
    beforeEnter: node.beforeEnter
  });

  if (node.children.length === 0) {
    chains.push(chain);
    return;
  }
  for (const child of node.children) {
    flattenNode(chain, chains, child);
  }
};

import type { RouteChain, RouteNode, RouteRedirect, RouteTree } from './interface';
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

/**
 * Extracts the redirects (that is <ion-route-redirect> elements inside the root).
 *
 * The redirects are returned as a list of RouteRedirect.
 */
export const readRedirects = (root: Element): RouteRedirect[] => {
  return (Array.from(root.children) as HTMLIonRouteRedirectElement[])
    .filter((el) => el.tagName === 'ION-ROUTE-REDIRECT')
    .map((el) => {
      const to = readProp(el, 'to');
      return {
        from: parsePath(readProp(el, 'from')).segments,
        to: to == null ? undefined : parsePath(to),
      };
    });
};

/**
 * Extracts all the routes (that is <ion-route> elements inside the root).
 *
 * The routes are returned as a list of chains - the flattened tree.
 */
export const readRoutes = (root: Element): RouteChain[] => {
  return flattenRouterTree(readRouteNodes(root));
};

/**
 * Stencil patches `elm.children` to behave like calling `elm.children` on an
 * element with shadow DOM even though the `ion-router` is not a shadow DOM element.
 * To allow the `ion-router` to work properly we need to access the original accessor
 * for this property which is `__children`.
 */
interface PatchedStencilElement extends Element {
  __children?: HTMLCollection;
}

/**
 * Reads the route nodes as a tree modeled after the DOM tree of <ion-route> elements.
 *
 * Note: routes without a component are ignored together with their children.
 */
export const readRouteNodes = (node: PatchedStencilElement): RouteTree => {
  return (Array.from(node.__children ?? []) as HTMLIonRouteElement[])
    .filter((el) => el.tagName === 'ION-ROUTE' && el.component)
    .map((el) => {
      const component = readProp(el, 'component') as string;
      return {
        segments: parsePath(readProp(el, 'url')).segments,
        id: component.toLowerCase(),
        params: el.componentProps,
        beforeLeave: el.beforeLeave,
        beforeEnter: el.beforeEnter,
        children: readRouteNodes(el),
      };
    });
};

/**
 * Flattens a RouterTree in a list of chains.
 *
 * Each chain represents a path from the root node to a terminal node.
 */
export const flattenRouterTree = (nodes: RouteTree): RouteChain[] => {
  const chains: RouteChain[] = [];
  for (const node of nodes) {
    flattenNode([], chains, node);
  }
  return chains;
};

/** Flattens a route node recursively and push each branch to the chains list. */
const flattenNode = (chain: RouteChain, chains: RouteChain[], node: RouteNode) => {
  chain = [
    ...chain,
    {
      id: node.id,
      segments: node.segments,
      params: node.params,
      beforeLeave: node.beforeLeave,
      beforeEnter: node.beforeEnter,
    },
  ];

  if (node.children.length === 0) {
    chains.push(chain);
    return;
  }
  for (const child of node.children) {
    flattenNode(chain, chains, child);
  }
};

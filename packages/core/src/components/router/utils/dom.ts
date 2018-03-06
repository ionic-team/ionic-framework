import { breadthFirstSearch } from './common';
import { NavOutlet, RouteChain } from './interfaces';

export function writeNavState(root: HTMLElement, chain: RouteChain, index: number, direction: number): Promise<void> {
  if (index >= chain.length) {
    return Promise.resolve();
  }
  const route = chain[index];
  const node = breadthFirstSearch(root);
  if (!node) {
    return Promise.resolve();
  }
  return node.componentOnReady()
    .then(() => node.setRouteId(route.id, route.props, direction))
    .then(changed => {
      if (changed) {
        direction = 0;
      }
      const nextEl = node.getContentElement();
      if (nextEl) {
        return writeNavState(nextEl, chain, index + 1, direction)
          .then(() => node.markVisible());
      } else {
        return node.markVisible();
      }
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
    ids: stack,
    pivot: pivot,
  };
}

import { breadthFirstSearch } from './common';
import { NavOutlet, RouteChain, RouteID } from './interfaces';

export function writeNavState(root: HTMLElement, chain: RouteChain|null, index: number, direction: number): Promise<void> {
  if (!chain || index >= chain.length) {
    return Promise.resolve();
  }
  const route = chain[index];
  const node = breadthFirstSearch(root);
  if (!node) {
    return Promise.resolve();
  }
  return node.componentOnReady()
    .then(() => node.setRouteId(route.id, route.params, direction))
    .then(changed => {
      if (changed) {
        direction = 0;
      }
      const nextEl = node.getContainerEl();
      const promise = (nextEl)
        ? writeNavState(nextEl, chain, index + 1, direction)
        : Promise.resolve();

      if (node.markVisible) {
        return promise.then(() => node.markVisible());
      }
      return promise;
    });
}

export function readNavState(node: HTMLElement) {
  const ids: RouteID[] = [];
  let pivot: NavOutlet|null;
  while (true) {
    pivot = breadthFirstSearch(node);
    if (pivot) {
      const id = pivot.getRouteId();
      if (id) {
        node = pivot.getContainerEl();
        ids.push(id);
      } else {
        break;
      }
    } else {
      break;
    }
  }
  return {ids, pivot};
}

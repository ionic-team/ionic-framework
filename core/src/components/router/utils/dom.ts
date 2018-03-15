import { NavOutlet, NavOutletElement, RouteChain, RouteID } from './interfaces';

export function writeNavState(root: HTMLElement, chain: RouteChain|null, index: number, direction: number): Promise<boolean> {
  if (!chain || index >= chain.length) {
    return Promise.resolve(direction === 0);
  }
  const route = chain[index];
  const node = searchNavNode(root);
  if (!node) {
    return Promise.resolve(direction === 0);
  }
  return node.componentOnReady()
    .then(() => node.setRouteId(route.id, route.params, direction))
    .then(result => {
      if (result.changed) {
        direction = 0;
      }
      const nextEl = node.getContainerEl();
      const promise = (nextEl)
        ? writeNavState(nextEl, chain, index + 1, direction)
        : Promise.resolve(direction === 0);

      if (result.markVisible) {
        return promise.then((c) => {
          result.markVisible();
          return c;
        });
      }
      return promise;
    });
}

export function readNavState(node: HTMLElement) {
  const ids: RouteID[] = [];
  let pivot: NavOutlet|null;
  while (true) {
    pivot = searchNavNode(node);
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

const QUERY = ':not([no-router]) ion-nav,:not([no-router]) ion-tabs';

function searchNavNode(root: HTMLElement): NavOutletElement {
  if (root.matches(QUERY)) {
    return root as NavOutletElement;
  }
  return root.querySelector(QUERY);
}

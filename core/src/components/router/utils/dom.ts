import { NavOutlet, NavOutletElement, RouteChain, RouteID, RouterDirection } from './interfaces';

export async function writeNavState(root: HTMLElement|undefined, chain: RouteChain|null, direction: RouterDirection, index: number): Promise<boolean> {
  // find next navigation outlet in the DOM
  const outlet = searchNavNode(root);

  // make sure we can continue interating the DOM, otherwise abort
  if (!chain || index >= chain.length || !outlet) {
    return direction === 0;
  }
  await outlet.componentOnReady();

  const route = chain[index];
  const result = await outlet.setRouteId(route.id, route.params, direction);

  // if the outlet changed the page, reset navigation to neutral (no direction)
  // this means nested outlets will not animate
  if (result.changed) {
    direction = RouterDirection.None;
  }

  // recursivelly set nested outlets
  const changed = await writeNavState(result.element, chain, direction, index + 1);

  // once all nested outlets are visible let's make the parent visible too,
  // using markVisible prevents flickering
  if (result.markVisible) {
    await result.markVisible();
  }
  return changed;
}

export function readNavState(root: HTMLElement | null) {
  const ids: RouteID[] = [];
  let outlet: NavOutlet|null;
  let node: HTMLElement|null = root;
  while (true) {
    outlet = searchNavNode(node);
    if (outlet) {
      const id = outlet.getRouteId();
      if (id) {
        node = id.element;
        id.element = undefined;
        ids.push(id);
      } else {
        break;
      }
    } else {
      break;
    }
  }
  return {ids, outlet};
}

const QUERY = ':not([no-router]) ion-nav,:not([no-router]) ion-tabs, :not([no-router]) ion-router-outlet';

function searchNavNode(root: HTMLElement|undefined): NavOutletElement|null {
  if (!root) {
    return null;
  }
  if (root.matches(QUERY)) {
    return root as NavOutletElement;
  }
  return root.querySelector(QUERY);
}

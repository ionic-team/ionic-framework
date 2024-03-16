import { componentOnReady } from '@utils/helpers';

import type { AnimationBuilder } from '../../../interface';

import { ROUTER_INTENT_NONE } from './constants';
import type { NavOutletElement, RouteChain, RouteID, RouterDirection } from './interface';

/**
 * Activates the passed route chain.
 *
 * There must be exactly one outlet per route entry in the chain.
 *
 * The methods calls setRouteId on each of the outlet with the corresponding route entry in the chain.
 * setRouteId will create or select the view in the outlet.
 */
export const writeNavState = async (
  root: HTMLElement | undefined,
  chain: RouteChain,
  direction: RouterDirection,
  index: number,
  changed = false,
  animation?: AnimationBuilder
): Promise<boolean> => {
  try {
    // find next navigation outlet in the DOM
    const outlet = searchNavNode(root);

    // make sure we can continue interacting the DOM, otherwise abort
    if (index >= chain.length || !outlet) {
      return changed;
    }
    await new Promise((resolve) => componentOnReady(outlet, resolve));

    const route = chain[index];
    const result = await outlet.setRouteId(route.id, route.params, direction, animation);

    // if the outlet changed the page, reset navigation to neutral (no direction)
    // this means nested outlets will not animate
    if (result.changed) {
      direction = ROUTER_INTENT_NONE;
      changed = true;
    }

    // recursively set nested outlets
    changed = await writeNavState(result.element, chain, direction, index + 1, changed, animation);

    // once all nested outlets are visible let's make the parent visible too,
    // using markVisible prevents flickering
    if (result.markVisible) {
      await result.markVisible();
    }
    return changed;
  } catch (e) {
    console.error(e);
    return false;
  }
};

/**
 * Recursively walks the outlet in the DOM.
 *
 * The function returns a list of RouteID corresponding to each of the outlet and the last outlet without a RouteID.
 */
export const readNavState = async (root: HTMLElement | undefined) => {
  const ids: RouteID[] = [];
  let outlet: NavOutletElement | undefined;
  let node: HTMLElement | undefined = root;

  // eslint-disable-next-line no-cond-assign
  while ((outlet = searchNavNode(node))) {
    const id = await outlet.getRouteId();
    if (id) {
      node = id.element;
      id.element = undefined;
      ids.push(id);
    } else {
      break;
    }
  }
  return { ids, outlet };
};

export const waitUntilNavNode = (): Promise<void> => {
  if (searchNavNode(document.body)) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    window.addEventListener('ionNavWillLoad', () => resolve(), { once: true });
  });
};

/** Selector for all the outlets supported by the router. */
const OUTLET_SELECTOR = ':not([no-router]) ion-nav, :not([no-router]) ion-tabs, :not([no-router]) ion-router-outlet';

const searchNavNode = (root: HTMLElement | undefined): NavOutletElement | undefined => {
  if (!root) {
    return undefined;
  }
  if (root.matches(OUTLET_SELECTOR)) {
    return root as NavOutletElement;
  }
  const outlet = root.querySelector<NavOutletElement>(OUTLET_SELECTOR);
  return outlet ?? undefined;
};

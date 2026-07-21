import { findClosestIonContent, getScrollElement, isIonContent } from '@utils/content';
import { componentOnReady, raf } from '@utils/helpers';
import { printIonError } from '@utils/logging';

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
    printIonError('[ion-router] - Exception in writeNavState:', e);
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

/** Max animation frames `scrollToFragment` polls while waiting for the target to mount. */
const FRAGMENT_POLL_FRAMES = 30;

/** Duration (ms) of the smooth-scroll animation that lands on the fragment target. */
const FRAGMENT_SCROLL_DURATION = 300;

const nextFrame = () => new Promise<void>((resolve) => raf(() => resolve()));

/**
 * Returns true when `el` lives inside an active `.ion-page`. `ion-page-hidden`
 * marks nav back-stack entries; `tab-hidden` marks inactive `ion-tab` elements.
 * Either class on the page's ancestor chain disqualifies it. When no `.ion-page`
 * exists in the document at all (non-router pages), the candidate is accepted
 * so plain anchors still work.
 */
const isInActivePage = (el: HTMLElement): boolean => {
  const page = el.closest<HTMLElement>('.ion-page');
  if (page === null) {
    return document.querySelector('.ion-page') === null;
  }
  return page.closest('.ion-page-hidden, .tab-hidden') === null;
};

/**
 * Polls across animation frames for an element matching `fragment` that lives
 * in the active page. Scoping by "last `.ion-page:not(.ion-page-hidden)`" is
 * unreliable: inactive `ion-tab` siblings carry `.ion-page` (gated by
 * `.tab-hidden`, not `.ion-page-hidden`) and can be ordered after the leaf.
 * Instead, locate candidates globally and walk them from last to first,
 * accepting the deepest one whose `.ion-page` ancestor is not hidden. The
 * last-to-first order preserves leaf-most preference for nested outlets.
 */
const findFragmentTarget = async (fragment: string, shouldContinue: () => boolean): Promise<HTMLElement | null> => {
  // CSS.escape is unavailable on very old WebViews; the fallback path uses
  // `getElementById` and drops the legacy `<a name>` branch.
  const canEscape = typeof CSS !== 'undefined' && typeof CSS.escape === 'function';
  const escaped = canEscape ? CSS.escape(fragment) : null;

  for (let i = 0; i < FRAGMENT_POLL_FRAMES; i++) {
    if (!shouldContinue()) return null;

    let candidates: HTMLElement[] = [];
    if (escaped !== null) {
      try {
        candidates = [...document.querySelectorAll<HTMLElement>(`#${escaped}, a[name="${escaped}"]`)];
      } catch {
        candidates = [...document.querySelectorAll<HTMLElement>(`#${escaped}`)];
      }
    } else {
      const byId = document.getElementById(fragment);
      if (byId !== null) candidates = [byId];
    }

    for (let j = candidates.length - 1; j >= 0; j--) {
      if (isInActivePage(candidates[j])) {
        return candidates[j];
      }
    }
    await nextFrame();
  }

  return null;
};

/**
 * Scrolls to the element whose id matches `fragment`, falling back to a legacy
 * `<a name="...">` target. When the target lives inside an `ion-content`, the
 * scroll uses its smooth-animated scroll API; otherwise it falls back to
 * `Element.scrollIntoView`.
 *
 * `shouldContinue` lets callers cancel in-flight scrolls when a newer
 * navigation supersedes this one. It is checked between async steps.
 */
export const scrollToFragment = async (
  fragment: string | undefined,
  shouldContinue: () => boolean = () => true
): Promise<boolean> => {
  if (fragment == null || fragment === '') {
    return false;
  }

  // URL fragments are percent-encoded but element ids are not; decode for
  // matching per the HTML spec's indicated-element resolution.
  let decoded: string;
  try {
    decoded = decodeURIComponent(fragment);
  } catch {
    decoded = fragment;
  }

  const target = await findFragmentTarget(decoded, shouldContinue);
  if (!target || !shouldContinue()) {
    return false;
  }

  // Best-effort scroll: swallow exceptions if the page tears down mid-animation.
  try {
    const contentHost = findClosestIonContent(target);
    if (contentHost && isIonContent(contentHost)) {
      const content = contentHost as HTMLIonContentElement;
      const scrollEl = await getScrollElement(content);
      // Yield one frame so the newly mounted target's layout is stable
      // before we measure its rect.
      await nextFrame();
      if (!shouldContinue()) return false;
      const targetRect = target.getBoundingClientRect();
      const scrollRect = scrollEl.getBoundingClientRect();
      const top = targetRect.top - scrollRect.top + scrollEl.scrollTop;
      // Preserve scrollLeft so RTL and horizontally-scrolling pages aren't reset.
      await content.scrollToPoint(scrollEl.scrollLeft, top, FRAGMENT_SCROLL_DURATION);
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    return true;
  } catch (e) {
    printIonError('[ion-router] - Exception in scrollToFragment:', e);
    return false;
  }
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

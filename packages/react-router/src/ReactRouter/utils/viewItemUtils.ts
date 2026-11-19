import type { RouteInfo, ViewItem } from '@ionic/react';

/**
 * Compares two routes by specificity for sorting (most specific first).
 *
 * Sort order:
 * 1. Index routes come first
 * 2. Wildcard-only routes (* or /*) come last
 * 3. Exact matches (no wildcards/params) before wildcard/param routes
 * 4. Among routes with same status, longer paths are more specific
 */
export const compareRouteSpecificity = (
  a: { path: string; index: boolean },
  b: { path: string; index: boolean }
): number => {
  // Index routes come first
  if (a.index && !b.index) return -1;
  if (!a.index && b.index) return 1;

  // Wildcard-only routes (* or /*) should come last
  const aIsWildcardOnly = a.path === '*' || a.path === '/*';
  const bIsWildcardOnly = b.path === '*' || b.path === '/*';
  if (!aIsWildcardOnly && bIsWildcardOnly) return -1;
  if (aIsWildcardOnly && !bIsWildcardOnly) return 1;

  // Exact matches (no wildcards/params) come before wildcard/param routes
  const aHasWildcard = a.path.includes('*') || a.path.includes(':');
  const bHasWildcard = b.path.includes('*') || b.path.includes(':');
  if (!aHasWildcard && bHasWildcard) return -1;
  if (aHasWildcard && !bHasWildcard) return 1;

  // Among routes with same wildcard status, longer paths are more specific
  if (a.path.length !== b.path.length) {
    return b.path.length - a.path.length;
  }

  return 0;
};

/**
 * True when a route matches more pathnames than its own path, so a splat, an index route,
 * or a route with an empty or absent path. A lookup can return one of these for a pathname
 * a more specific sibling owns, so callers must confirm ownership against React Router's
 * ranking before reusing the view item.
 *
 * This is deliberately wider than the catch-all checks in ReactRouterViewStack, which each
 * gate on a narrower shape for a different reason. Don't unify them with this helper.
 */
export const isOverMatchingRoute = (route: { path?: string; index?: boolean }): boolean => {
  const { path, index } = route;
  return !path || path.includes('*') || !!index;
};

/** True when the navigation pushed a new page forward on top of the current one. */
export const isForwardPush = (routeInfo: Pick<RouteInfo, 'routeAction' | 'routeDirection'>): boolean =>
  routeInfo.routeAction === 'push' && routeInfo.routeDirection === 'forward';

const swipeRevealed = new WeakSet<ViewItem>();

/**
 * Marks the page a swipe-back gesture has revealed. For the length of the drag that page
 * is on screen while a more specific sibling still matches the current pathname, and the
 * deactivation scan in `renderViewItem` would otherwise re-hide it on the next render and
 * leave the user dragging a blank page.
 */
export const markSwipeRevealed = (viewItem: ViewItem | undefined): void => {
  if (viewItem) {
    swipeRevealed.add(viewItem);
  }
};

/** Drops the mark once the gesture ends, so the view is hidden normally again. */
export const clearSwipeRevealed = (viewItem: ViewItem | undefined): void => {
  if (viewItem) {
    swipeRevealed.delete(viewItem);
  }
};

/** True while a swipe-back gesture is showing this view. */
export const isSwipeRevealed = (viewItem: ViewItem): boolean => swipeRevealed.has(viewItem);

/**
 * Sorts view items by route specificity (most specific first).
 *
 * Sort order aligns with findViewItemByPath in ReactRouterViewStack.tsx:
 * 1. Index routes come first
 * 2. Wildcard-only routes (* or /*) come last
 * 3. Exact matches (no wildcards/params) come before wildcard/param routes
 * 4. Among routes with same wildcard status, longer paths are more specific
 *
 * @param views The view items to sort.
 * @returns A new sorted array of view items.
 */
export const sortViewsBySpecificity = (views: ViewItem[]): ViewItem[] => {
  return [...views].sort((a, b) =>
    compareRouteSpecificity(
      { path: a.routeData?.childProps?.path || '', index: !!a.routeData?.childProps?.index },
      { path: b.routeData?.childProps?.path || '', index: !!b.routeData?.childProps?.index }
    )
  );
};

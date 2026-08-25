import type { ViewItem } from '@ionic/react';

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

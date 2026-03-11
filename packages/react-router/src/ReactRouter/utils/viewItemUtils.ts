import type { ViewItem } from '@ionic/react';

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
  return [...views].sort((a, b) => {
    const pathA = a.routeData?.childProps?.path || '';
    const pathB = b.routeData?.childProps?.path || '';

    // Index routes come first
    const aIsIndex = !!a.routeData?.childProps?.index;
    const bIsIndex = !!b.routeData?.childProps?.index;
    if (aIsIndex && !bIsIndex) return -1;
    if (!aIsIndex && bIsIndex) return 1;

    // Wildcard-only routes (* or /*) should come last
    const aIsWildcardOnly = pathA === '*' || pathA === '/*';
    const bIsWildcardOnly = pathB === '*' || pathB === '/*';
    if (!aIsWildcardOnly && bIsWildcardOnly) return -1;
    if (aIsWildcardOnly && !bIsWildcardOnly) return 1;

    // Exact matches (no wildcards/params) come before wildcard/param routes
    const aHasWildcard = pathA.includes('*') || pathA.includes(':');
    const bHasWildcard = pathB.includes('*') || pathB.includes(':');
    if (!aHasWildcard && bHasWildcard) return -1;
    if (aHasWildcard && !bHasWildcard) return 1;

    // Among routes with same wildcard status, longer paths are more specific
    if (pathA.length !== pathB.length) {
      return pathB.length - pathA.length;
    }

    return 0;
  });
};

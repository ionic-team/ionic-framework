import type { ViewItem } from '@ionic/react';

/**
 * Sorts view items by route specificity (most specific first).
 * - Exact matches (no wildcards/params) come first
 * - Among wildcard routes, longer paths are more specific
 *
 * @param views The view items to sort.
 * @returns A new sorted array of view items.
 */
export const sortViewsBySpecificity = (views: ViewItem[]): ViewItem[] => {
  return [...views].sort((a, b) => {
    const pathA = a.routeData?.childProps?.path || '';
    const pathB = b.routeData?.childProps?.path || '';

    // Exact matches (no wildcards/params) come first
    const aHasWildcard = pathA.includes('*') || pathA.includes(':');
    const bHasWildcard = pathB.includes('*') || pathB.includes(':');

    if (!aHasWildcard && bHasWildcard) return -1;
    if (aHasWildcard && !bHasWildcard) return 1;

    // Among wildcard routes, longer paths are more specific
    return pathB.length - pathA.length;
  });
};

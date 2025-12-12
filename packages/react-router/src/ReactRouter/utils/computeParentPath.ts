import type React from 'react';

import { matchPath } from './pathMatching';

/**
 * Finds the longest common prefix among an array of paths.
 * Used to determine the scope of an outlet with absolute routes.
 *
 * @param paths An array of absolute path strings.
 * @returns The common prefix shared by all paths.
 */
export const computeCommonPrefix = (paths: string[]): string => {
  if (paths.length === 0) return '';
  if (paths.length === 1) {
    // For a single path, extract the directory-like prefix
    // e.g., /dynamic-routes/home -> /dynamic-routes
    const segments = paths[0].split('/').filter(Boolean);
    if (segments.length > 1) {
      return '/' + segments.slice(0, -1).join('/');
    }
    return '/' + segments[0];
  }

  // Split all paths into segments
  const segmentArrays = paths.map((p) => p.split('/').filter(Boolean));
  const minLength = Math.min(...segmentArrays.map((s) => s.length));

  const commonSegments: string[] = [];
  for (let i = 0; i < minLength; i++) {
    const segment = segmentArrays[0][i];
    // Skip segments with route parameters or wildcards
    if (segment.includes(':') || segment.includes('*')) {
      break;
    }
    const allMatch = segmentArrays.every((s) => s[i] === segment);
    if (allMatch) {
      commonSegments.push(segment);
    } else {
      break;
    }
  }

  return commonSegments.length > 0 ? '/' + commonSegments.join('/') : '';
};

/**
 * Checks if a route path is a "splat-only" route (just `*` or `/*`).
 */
const isSplatOnlyRoute = (routePath: string | undefined): boolean => {
  return routePath === '*' || routePath === '/*';
};

/**
 * Checks if a route has an embedded wildcard (e.g., "tab1/*" but not "*" or "/*").
 */
const hasEmbeddedWildcard = (routePath: string | undefined): boolean => {
  return !!routePath && routePath.includes('*') && !isSplatOnlyRoute(routePath);
};

/**
 * Checks if a route with an embedded wildcard matches a pathname.
 */
const matchesEmbeddedWildcardRoute = (route: React.ReactElement, pathname: string): boolean => {
  const routePath = route.props.path as string | undefined;
  if (!hasEmbeddedWildcard(routePath)) {
    return false;
  }
  return !!matchPath({ pathname, componentProps: route.props });
};

/**
 * Checks if a route is a specific match (not wildcard-only or index).
 */
export const isSpecificRouteMatch = (route: React.ReactElement, remainingPath: string): boolean => {
  const routePath = route.props.path;
  if (route.props.index || isSplatOnlyRoute(routePath)) {
    return false;
  }
  return !!matchPath({ pathname: remainingPath, componentProps: route.props });
};

/**
 * Result of parent path computation.
 */
export interface ParentPathResult {
  parentPath: string | undefined;
  outletMountPath: string | undefined;
}

interface RouteAnalysis {
  hasRelativeRoutes: boolean;
  hasIndexRoute: boolean;
  hasWildcardRoute: boolean;
  routeChildren: React.ReactElement[];
}

/**
 * Analyzes route children to determine their characteristics.
 *
 * @param routeChildren The route children to analyze.
 * @returns Analysis of the route characteristics.
 */
export const analyzeRouteChildren = (routeChildren: React.ReactElement[]): RouteAnalysis => {
  const hasRelativeRoutes = routeChildren.some((route) => {
    const path = route.props.path;
    return path && !path.startsWith('/') && path !== '*';
  });

  const hasIndexRoute = routeChildren.some((route) => route.props.index);

  const hasWildcardRoute = routeChildren.some((route) => {
    const routePath = route.props.path;
    return routePath === '*' || routePath === '/*';
  });

  return { hasRelativeRoutes, hasIndexRoute, hasWildcardRoute, routeChildren };
};

interface ComputeParentPathOptions {
  currentPathname: string;
  outletMountPath: string | undefined;
  routeChildren: React.ReactElement[];
  hasRelativeRoutes: boolean;
  hasIndexRoute: boolean;
  hasWildcardRoute: boolean;
}

/**
 * Computes the parent path for a nested outlet based on the current pathname
 * and the outlet's route configuration.
 *
 * The algorithm finds the shortest parent path where a route matches the remaining path.
 * Priority: specific routes > wildcard routes > index routes (only at mount point)
 *
 * @param options The options for computing the parent path.
 * @returns The computed parent path result.
 */
export const computeParentPath = (options: ComputeParentPathOptions): ParentPathResult => {
  const { currentPathname, outletMountPath, routeChildren, hasRelativeRoutes, hasIndexRoute, hasWildcardRoute } =
    options;

  // If this outlet previously established a mount path and the current
  // pathname is outside of that scope, do not attempt to re-compute a new
  // parent path.
  if (outletMountPath && !currentPathname.startsWith(outletMountPath)) {
    return { parentPath: undefined, outletMountPath };
  }

  if ((hasRelativeRoutes || hasIndexRoute) && currentPathname.includes('/')) {
    const segments = currentPathname.split('/').filter(Boolean);

    if (segments.length >= 1) {
      // Find matches at each level, keeping track of the FIRST (shortest) match
      let firstSpecificMatch: string | undefined = undefined;
      let firstWildcardMatch: string | undefined = undefined;
      let indexMatchAtMount: string | undefined = undefined;

      // Start at i = 1 (normal case: strip at least one segment for parent path)
      for (let i = 1; i <= segments.length; i++) {
        const parentPath = '/' + segments.slice(0, i).join('/');
        const remainingPath = segments.slice(i).join('/');

        // Check for specific route matches (non-wildcard-only, non-index)
        // Also check routes with embedded wildcards (e.g., "tab1/*")
        const hasSpecificMatch = routeChildren.some(
          (route) => isSpecificRouteMatch(route, remainingPath) || matchesEmbeddedWildcardRoute(route, remainingPath)
        );
        if (hasSpecificMatch && !firstSpecificMatch) {
          firstSpecificMatch = parentPath;
          // Found a specific match - this is our answer for non-index routes
          break;
        }

        // Check if wildcard would match this remaining path
        // Only if remaining is non-empty (wildcard needs something to match)
        if (remainingPath !== '' && remainingPath !== '/' && hasWildcardRoute && !firstWildcardMatch) {
          // Check if any specific route could plausibly match this remaining path
          const remainingFirstSegment = remainingPath.split('/')[0];
          const couldAnyRouteMatch = routeChildren.some((route) => {
            const routePath = route.props.path as string | undefined;
            if (!routePath || routePath === '*' || routePath === '/*') return false;
            if (route.props.index) return false;

            const routeFirstSegment = routePath.split('/')[0].replace(/[*:]/g, '');
            if (!routeFirstSegment) return false;

            // Check for prefix overlap (either direction)
            return (
              routeFirstSegment.startsWith(remainingFirstSegment.slice(0, 3)) ||
              remainingFirstSegment.startsWith(routeFirstSegment.slice(0, 3))
            );
          });

          // Only save wildcard match if no specific route could match
          if (!couldAnyRouteMatch) {
            firstWildcardMatch = parentPath;
            // Continue looking - might find a specific match at a longer path
          }
        }

        // Check for index route match when remaining path is empty
        // BUT only at the outlet's mount path level
        if ((remainingPath === '' || remainingPath === '/') && hasIndexRoute) {
          // Index route matches when current path exactly matches the mount path
          // If we already have an outletMountPath, index should only match there
          if (outletMountPath) {
            if (parentPath === outletMountPath) {
              indexMatchAtMount = parentPath;
            }
          } else {
            // No mount path set yet - index would establish this as mount path
            // But only if we haven't found a better match
            indexMatchAtMount = parentPath;
          }
        }
      }

      // Fallback: check at root level (i = 0) for embedded wildcard routes.
      // This handles outlets inside root-level splat routes where routes like
      // "tab1/*" need to match the full pathname.
      if (!firstSpecificMatch) {
        const fullRemainingPath = segments.join('/');
        const hasRootLevelMatch = routeChildren.some((route) => matchesEmbeddedWildcardRoute(route, fullRemainingPath));
        if (hasRootLevelMatch) {
          firstSpecificMatch = '/';
        }
      }

      // Determine the best parent path:
      // 1. Specific match (routes like tabs/*, favorites) - highest priority
      // 2. Wildcard match (route path="*") - catches unmatched segments
      // 3. Index match - only valid at the outlet's mount point, not deeper
      let bestPath: string | undefined = undefined;

      if (firstSpecificMatch) {
        bestPath = firstSpecificMatch;
      } else if (firstWildcardMatch) {
        bestPath = firstWildcardMatch;
      } else if (indexMatchAtMount) {
        // Only use index match if no specific or wildcard matched
        // This handles the case where pathname exactly matches the mount path
        bestPath = indexMatchAtMount;
      }

      // Store the mount path when we first successfully match a route
      let newOutletMountPath = outletMountPath;
      if (!outletMountPath && bestPath) {
        newOutletMountPath = bestPath;
      }

      // If we have a mount path, verify the current pathname is within scope
      if (newOutletMountPath && !currentPathname.startsWith(newOutletMountPath)) {
        return { parentPath: undefined, outletMountPath: newOutletMountPath };
      }

      return { parentPath: bestPath, outletMountPath: newOutletMountPath };
    }
  }

  // Handle outlets with ONLY absolute routes (no relative routes or index routes)
  // Compute the common prefix of all absolute routes to determine the outlet's scope
  if (!hasRelativeRoutes && !hasIndexRoute) {
    const absolutePathRoutes = routeChildren.filter((route) => {
      const path = route.props.path;
      return path && path.startsWith('/');
    });

    if (absolutePathRoutes.length > 0) {
      const absolutePaths = absolutePathRoutes.map((r) => r.props.path as string);
      const commonPrefix = computeCommonPrefix(absolutePaths);

      if (commonPrefix && commonPrefix !== '/') {
        // Set the mount path based on common prefix of absolute routes
        const newOutletMountPath = outletMountPath || commonPrefix;

        // Check if current pathname is within scope
        if (!currentPathname.startsWith(commonPrefix)) {
          return { parentPath: undefined, outletMountPath: newOutletMountPath };
        }

        return { parentPath: commonPrefix, outletMountPath: newOutletMountPath };
      }
    }
  }

  return { parentPath: outletMountPath, outletMountPath };
};

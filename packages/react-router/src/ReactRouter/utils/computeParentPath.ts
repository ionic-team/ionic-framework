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
 * Checks if any route matches as a specific (non-wildcard, non-index) route.
 */
const findSpecificMatch = (routeChildren: React.ReactElement[], remainingPath: string): boolean => {
  return routeChildren.some(
    (route) => isSpecificRouteMatch(route, remainingPath) || matchesEmbeddedWildcardRoute(route, remainingPath)
  );
};

/**
 * Checks if any specific route could plausibly match the remaining path.
 * Used to determine if we should fall back to a wildcard match.
 */
const couldSpecificRouteMatch = (routeChildren: React.ReactElement[], remainingPath: string): boolean => {
  const remainingFirstSegment = remainingPath.split('/')[0];
  return routeChildren.some((route) => {
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
};

/**
 * Checks for index route match when remaining path is empty.
 * Index routes only match at the outlet's mount path level.
 */
const checkIndexMatch = (
  parentPath: string,
  remainingPath: string,
  hasIndexRoute: boolean,
  outletMountPath: string | undefined
): string | undefined => {
  if ((remainingPath === '' || remainingPath === '/') && hasIndexRoute) {
    if (outletMountPath) {
      // Index should only match at the existing mount path
      return parentPath === outletMountPath ? parentPath : undefined;
    }
    // No mount path yet - this would establish it
    return parentPath;
  }
  return undefined;
};

/**
 * Determines the best parent path from the available matches.
 * Priority: specific > wildcard > index
 */
const selectBestMatch = (
  specificMatch: string | undefined,
  wildcardMatch: string | undefined,
  indexMatch: string | undefined
): string | undefined => {
  return specificMatch ?? wildcardMatch ?? indexMatch;
};

/**
 * Handles outlets with only absolute routes by computing their common prefix.
 */
const computeAbsoluteRoutesParentPath = (
  routeChildren: React.ReactElement[],
  currentPathname: string,
  outletMountPath: string | undefined
): ParentPathResult | undefined => {
  const absolutePathRoutes = routeChildren.filter((route) => {
    const path = route.props.path;
    return path && path.startsWith('/');
  });

  if (absolutePathRoutes.length === 0) {
    return undefined;
  }

  const absolutePaths = absolutePathRoutes.map((r) => r.props.path as string);
  const commonPrefix = computeCommonPrefix(absolutePaths);

  if (!commonPrefix || commonPrefix === '/') {
    return undefined;
  }

  const newOutletMountPath = outletMountPath || commonPrefix;

  if (!currentPathname.startsWith(commonPrefix)) {
    return { parentPath: undefined, outletMountPath: newOutletMountPath };
  }

  return { parentPath: commonPrefix, outletMountPath: newOutletMountPath };
};

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

  // If pathname is outside the established mount path scope, skip computation
  if (outletMountPath && !currentPathname.startsWith(outletMountPath)) {
    return { parentPath: undefined, outletMountPath };
  }

  if ((hasRelativeRoutes || hasIndexRoute) && currentPathname.includes('/')) {
    const segments = currentPathname.split('/').filter(Boolean);

    if (segments.length >= 1) {
      let firstSpecificMatch: string | undefined;
      let firstWildcardMatch: string | undefined;
      let indexMatchAtMount: string | undefined;

      // Iterate through path segments to find the shortest matching parent path
      for (let i = 1; i <= segments.length; i++) {
        const parentPath = '/' + segments.slice(0, i).join('/');
        const remainingPath = segments.slice(i).join('/');

        // Check for specific route match (highest priority)
        if (!firstSpecificMatch && findSpecificMatch(routeChildren, remainingPath)) {
          firstSpecificMatch = parentPath;
          break;
        }

        // Check for wildcard match (only if remaining path is non-empty)
        const hasNonEmptyRemaining = remainingPath !== '' && remainingPath !== '/';
        if (!firstWildcardMatch && hasNonEmptyRemaining && hasWildcardRoute) {
          if (!couldSpecificRouteMatch(routeChildren, remainingPath)) {
            firstWildcardMatch = parentPath;
          }
        }

        // Check for index route match
        const indexMatch = checkIndexMatch(parentPath, remainingPath, hasIndexRoute, outletMountPath);
        if (indexMatch) {
          indexMatchAtMount = indexMatch;
        }
      }

      // Fallback: check root level for embedded wildcard routes (e.g., "tab1/*")
      if (!firstSpecificMatch) {
        const fullRemainingPath = segments.join('/');
        if (routeChildren.some((route) => matchesEmbeddedWildcardRoute(route, fullRemainingPath))) {
          firstSpecificMatch = '/';
        }
      }

      const bestPath = selectBestMatch(firstSpecificMatch, firstWildcardMatch, indexMatchAtMount);

      // Establish mount path on first successful match
      const newOutletMountPath = outletMountPath || bestPath;

      if (newOutletMountPath && !currentPathname.startsWith(newOutletMountPath)) {
        return { parentPath: undefined, outletMountPath: newOutletMountPath };
      }

      return { parentPath: bestPath, outletMountPath: newOutletMountPath };
    }
  }

  // Handle outlets with only absolute routes
  if (!hasRelativeRoutes && !hasIndexRoute) {
    const result = computeAbsoluteRoutesParentPath(routeChildren, currentPathname, outletMountPath);
    if (result) {
      return result;
    }
  }

  return { parentPath: outletMountPath, outletMountPath };
};

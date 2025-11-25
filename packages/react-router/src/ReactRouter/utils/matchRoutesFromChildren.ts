import React from 'react';
import type { RouteObject, AgnosticRouteMatch } from 'react-router';
import { matchRoutes } from 'react-router-dom';
import { Route } from 'react-router-dom';

/**
 * Sorts routes by specificity. React Router's matchRoutes respects route order,
 * so we need to ensure more specific routes come before wildcards.
 */
function sortRoutesBySpecificity(routes: RouteObject[]): RouteObject[] {
  return [...routes].sort((a, b) => {
    const pathA = a.path || '';
    const pathB = b.path || '';

    // Index routes come first
    if (a.index && !b.index) return -1;
    if (!a.index && b.index) return 1;

    // Wildcard-only routes (*) should come LAST
    const aIsWildcardOnly = pathA === '*';
    const bIsWildcardOnly = pathB === '*';

    if (!aIsWildcardOnly && bIsWildcardOnly) return -1;
    if (aIsWildcardOnly && !bIsWildcardOnly) return 1;

    // Routes with more segments are more specific
    const aSegments = pathA.split('/').filter(Boolean).length;
    const bSegments = pathB.split('/').filter(Boolean).length;
    if (aSegments !== bSegments) {
      return bSegments - aSegments;
    }

    // Exact matches (no wildcards/params) come before wildcard/param routes
    const aHasWildcard = pathA.includes('*') || pathA.includes(':');
    const bHasWildcard = pathB.includes('*') || pathB.includes(':');

    if (!aHasWildcard && bHasWildcard) return -1;
    if (aHasWildcard && !bHasWildcard) return 1;

    // Among routes with same wildcard status, longer paths are more specific
    return pathB.length - pathA.length;
  });
}

/**
 * Converts React Route children to RouteObject array for use with matchRoutes.
 * This allows us to use React Router's native matching algorithm.
 * Routes are sorted by specificity to ensure proper matching order.
 */
export function createRouteObjectsFromChildren(children: React.ReactNode): RouteObject[] {
  const routes: RouteObject[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type !== Route) {
      // Not a Route element, skip
      return;
    }

    const props = child.props as {
      path?: string;
      index?: boolean;
      caseSensitive?: boolean;
      element?: React.ReactNode;
      children?: React.ReactNode;
    };

    const route: RouteObject = {
      path: props.path,
      index: props.index,
      caseSensitive: props.caseSensitive,
      element: props.element,
    };

    // Handle nested routes if present
    if (props.children) {
      route.children = createRouteObjectsFromChildren(props.children);
    }

    routes.push(route);
  });

  // Sort routes by specificity before returning
  return sortRoutesBySpecificity(routes);
}

/**
 * Finds the best matching route for a given pathname using React Router's matchRoutes.
 * This properly handles wildcard routes, index routes, and prioritizes specific routes.
 *
 * @param children The React children containing Route elements
 * @param pathname The pathname to match against
 * @returns The matched routes or null if no match
 */
export function findMatchingRoutes(
  children: React.ReactNode,
  pathname: string
): AgnosticRouteMatch<string, RouteObject>[] | null {
  const routes = createRouteObjectsFromChildren(children);
  return matchRoutes(routes, pathname);
}

/**
 * Determines the parent path for a nested outlet by finding what prefix matches
 * when the routes are matched against the current pathname.
 *
 * This is crucial for nested routing where we need to know what portion of the
 * pathname was matched by the parent outlet.
 *
 * @param children The Route children of this outlet
 * @param pathname The current pathname
 * @returns The parent path prefix, or null if no match
 */
export function computeParentPathFromRoutes(
  children: React.ReactNode,
  pathname: string
): { parentPath: string; matchedRoute: RouteObject } | null {
  const routes = createRouteObjectsFromChildren(children);

  // Normalize pathname
  const normalizedPathname = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  const segments = normalizedPathname.split('/').filter(Boolean);

  // Try progressively shorter parent paths to find a match
  for (let i = 1; i <= segments.length; i++) {
    const testParentPath = '/' + segments.slice(0, i).join('/');
    const testRemainingPath = '/' + segments.slice(i).join('/');

    // Try to match the remaining path against our routes
    const matches = matchRoutes(routes, testRemainingPath);

    if (matches && matches.length > 0) {
      const lastMatch = matches[matches.length - 1];
      const matchedRoute = lastMatch.route;

      // Skip if the matched route is an index route and there's remaining path
      // Index routes should only match when the remaining path is empty
      if (matchedRoute.index && testRemainingPath !== '/' && testRemainingPath !== '') {
        continue;
      }

      if (process.env.NODE_ENV !== 'production') {
        console.log(
          `[matchRoutesFromChildren] Found match for ${pathname}: parentPath=${testParentPath}, matchedRoute.path=${matchedRoute.path ?? '(index)'}, pathnameBase=${lastMatch.pathnameBase}`
        );
      }

      return {
        parentPath: testParentPath,
        matchedRoute,
      };
    }
  }

  // No specific match found, but we might still have a wildcard that matches
  // Try matching the full pathname as just "/"
  const rootMatches = matchRoutes(routes, '/');
  if (rootMatches && rootMatches.length > 0) {
    const lastMatch = rootMatches[rootMatches.length - 1];

    // Only consider this if it's an index route (we're exactly at the parent)
    if (lastMatch.route.index) {
      const parentPath = '/' + segments.join('/');
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          `[matchRoutesFromChildren] Index route match for ${pathname}: parentPath=${parentPath}`
        );
      }
      return {
        parentPath,
        matchedRoute: lastMatch.route,
      };
    }
  }

  return null;
}

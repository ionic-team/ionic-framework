import type { PathMatch } from 'react-router';
import { matchPath as reactRouterMatchPath } from 'react-router-dom';

/**
 * Options for the matchPath function.
 */
interface MatchPathOptions {
  /**
   * The pathname to match against.
   */
  pathname: string;
  /**
   * The props to match against, they are identical to the matching props `Route` accepts.
   */
  componentProps: {
    path?: string;
    caseSensitive?: boolean;
    end?: boolean;
    index?: boolean;
  };
}

/**
 * The matchPath function is used only for matching paths, not rendering components or elements.
 * @see https://reactrouter.com/v6/utils/match-path
 */
export const matchPath = ({ pathname, componentProps }: MatchPathOptions): PathMatch<string> | null => {
  const { path, index, ...restProps } = componentProps;

  // Handle index routes - they match when pathname is empty or just "/"
  if (index && !path) {
    if (pathname === '' || pathname === '/') {
      return {
        params: {},
        pathname: pathname,
        pathnameBase: pathname || '/',
        pattern: {
          path: '',
          caseSensitive: false,
          end: true,
        },
      };
    }
    return null;
  }

  // Handle empty path routes - they match when pathname is also empty or just "/"
  if (path === '' || path === undefined) {
    if (pathname === '' || pathname === '/') {
      return {
        params: {},
        pathname: pathname,
        pathnameBase: pathname || '/',
        pattern: {
          path: '',
          caseSensitive: restProps.caseSensitive ?? false,
          end: restProps.end ?? true,
        },
      };
    }
    return null;
  }

  // For relative paths (don't start with '/'), normalize both path and pathname for matching
  if (!path.startsWith('/')) {
    const matchOptions: Parameters<typeof reactRouterMatchPath>[0] = {
      path: `/${path}`,
      ...restProps,
    };

    if (matchOptions?.end === undefined) {
      matchOptions.end = !path.endsWith('*');
    }

    const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
    const match = reactRouterMatchPath(matchOptions, normalizedPathname);

    if (match) {
      // Adjust the match to remove the leading '/' we added
      return {
        ...match,
        pathname: pathname,
        pathnameBase: match.pathnameBase === '/' ? '' : match.pathnameBase.slice(1),
        pattern: {
          ...match.pattern,
          path: path,
        },
      };
    }

    return null;
  }

  // For absolute paths, use React Router's matcher directly.
  // React Router v6 routes default to `end: true` unless the pattern
  // explicitly opts into wildcards with `*`. Mirror that behaviour so
  // matching parity stays aligned with <Route>.
  const matchOptions: Parameters<typeof reactRouterMatchPath>[0] = {
    path,
    ...restProps,
  };

  if (matchOptions?.end === undefined) {
    matchOptions.end = !path.endsWith('*');
  }

  return reactRouterMatchPath(matchOptions, pathname);
};

/**
 * Determines the portion of a pathname that a given route pattern should match against.
 * For absolute route patterns we return the full pathname. For relative patterns we
 * strip off the already-matched parent segments so React Router receives the remainder.
 */
export const derivePathnameToMatch = (fullPathname: string, routePath?: string): string => {
  // For absolute or empty routes, use the full pathname as-is
  if (!routePath || routePath === '' || routePath.startsWith('/')) {
    return fullPathname;
  }

  const trimmedPath = fullPathname.startsWith('/') ? fullPathname.slice(1) : fullPathname;
  if (!trimmedPath) {
    // For root-level relative routes (pathname is "/" and routePath is relative),
    // return the full pathname so matchPath can normalize both.
    // This allows routes like <Route path="foo/*" .../> at root level to work correctly.
    return fullPathname;
  }

  const fullSegments = trimmedPath.split('/').filter(Boolean);
  if (fullSegments.length === 0) {
    return '';
  }

  const routeSegments = routePath.split('/').filter(Boolean);
  if (routeSegments.length === 0) {
    return trimmedPath;
  }

  const wildcardIndex = routeSegments.findIndex((segment) => segment === '*' || segment === '**');

  if (wildcardIndex >= 0) {
    const baseSegments = routeSegments.slice(0, wildcardIndex);
    if (baseSegments.length === 0) {
      return trimmedPath;
    }

    const startIndex = fullSegments.findIndex((_, idx) =>
      baseSegments.every((seg, segIdx) => {
        const target = fullSegments[idx + segIdx];
        if (!target) {
          return false;
        }
        if (seg.startsWith(':')) {
          return true;
        }
        return target === seg;
      })
    );

    if (startIndex >= 0) {
      return fullSegments.slice(startIndex).join('/');
    }
  }

  if (routeSegments.length <= fullSegments.length) {
    return fullSegments.slice(fullSegments.length - routeSegments.length).join('/');
  }

  return fullSegments[fullSegments.length - 1] ?? trimmedPath;
};

import type { PathMatch } from 'react-router';
import { matchPath as reactRouterMatchPath } from 'react-router-dom';

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

  // Handle index routes
  if (index && !path) {
    // Index routes match when there's no additional path after the parent route
    // For example, in a nested outlet at /routing/*, the index route matches
    // when the relative path is empty (i.e., we're exactly at /routing)

    // If pathname is empty or just "/", it should match the index route
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

    // Otherwise, index routes don't match when there's additional path
    return null;
  }

  if (!path) {
    return null;
  }

  // For relative paths in nested routes (those that don't start with '/'),
  // use React Router's matcher against a normalized path.
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

    // No match found
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

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
  // we need special handling
  if (!path.startsWith('/')) {
    // For relative paths, we match directly against the pathname
    // which should already be the relative portion from the parent route

    // Handle wildcard routes like "tabs/*"
    if (path.endsWith('/*')) {
      const basePath = path.slice(0, -2); // Remove the /*
      if (pathname === basePath || pathname.startsWith(basePath + '/')) {
        // Match found for wildcard route
        return {
          params: { '*': pathname.slice(basePath.length + 1) }, // Capture the wildcard portion
          pathname: pathname,
          pathnameBase: basePath,
          pattern: {
            path: path,
            caseSensitive: restProps.caseSensitive || false,
            end: restProps.end || false,
          },
        };
      }
    }

    // Handle exact matches for relative paths
    if (pathname === path) {
      return {
        params: {},
        pathname: pathname,
        pathnameBase: pathname,
        pattern: {
          path: path,
          caseSensitive: restProps.caseSensitive || false,
          end: restProps.end !== false, // Default to true for exact matches
        },
      };
    }

    // Handle parameterized routes
    // For now, try with React Router's matcher by prepending '/'
    const testPath = '/' + path;
    const testPathname = '/' + pathname;
    const match = reactRouterMatchPath({ path: testPath, ...restProps }, testPathname);

    if (match) {
      // Adjust the match to remove the leading '/' we added
      return {
        ...match,
        pathname: pathname,
        pathnameBase: match.pathnameBase.slice(1) || '',
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

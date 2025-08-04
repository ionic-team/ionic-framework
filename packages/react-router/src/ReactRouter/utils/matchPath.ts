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
    // For index routes, let React Router handle them naturally.
    // Creating artificial matches here interferes with proper navigation.
    return null;
  }

  if (!path) {
    return null;
  }

  // First, try to match as-is (this handles absolute paths)
  let match = reactRouterMatchPath({ path, ...restProps }, pathname);

  if (match) {
    return match;
  }

  // If the path doesn't start with '/', it might be a relative path in a nested route
  // Try to match it against different segments of the pathname
  if (!path.startsWith('/')) {
    const pathSegments = pathname.split('/').filter(Boolean);

    // Try matching from the end of the pathname backwards
    // For example, if pathname is '/routing/favorites' and path is 'favorites',
    // we want to check if 'favorites' matches the last segment
    for (let i = pathSegments.length; i > 0; i--) {
      const segment = pathSegments[i - 1];
      
      // Try exact match with the segment
      if (segment === path) {
        const partialPathname = '/' + segment;
        const testPath = '/' + path;

        match = reactRouterMatchPath({ path: testPath, ...restProps }, partialPathname);

        if (match) {
          // Adjust the match to reflect the full pathname
          const adjustedMatch = {
            ...match,
            pathname: pathname,
            pathnameBase: pathname.substring(0, pathname.lastIndexOf('/' + segment)) || '/',
          };
          return adjustedMatch;
        }
      }
      
      // Also try full path matching for complex relative paths
      const partialPathname = '/' + pathSegments.slice(i - 1).join('/');
      const testPath = '/' + path;

      match = reactRouterMatchPath({ path: testPath, ...restProps }, partialPathname);

      if (match) {
        // Adjust the match to reflect the full pathname
        const adjustedMatch = {
          ...match,
          pathname: pathname,
          pathnameBase: pathname.substring(0, pathname.lastIndexOf('/' + pathSegments[i - 1])) || '/',
        };
        return adjustedMatch;
      }
    }
  }
  return null;
};

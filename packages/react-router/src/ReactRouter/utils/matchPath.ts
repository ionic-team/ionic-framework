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
    // from is removed in react-router v6 since Redirect was replaced with Navigate
    // component is removed in react-router v6, replaced with element but not used in this function
    // exact is removed in react-router v6
  };
}

/**
 * The matchPath function is used only for matching paths, not rendering components or elements.
 * @see https://reactrouter.com/v6/utils/match-path
 */
export const matchPath = ({
  pathname,
  componentProps,
}: MatchPathOptions): PathMatch<string> | null => {
  const { path, ...restProps } = componentProps;

  if (!path) {
    console.warn(
      '[Ionic] matchPath: No path prop provided. This will always return null.', {
      componentProps,
    });
    return null;
  }

  const match = reactRouterMatchPath({ path, ...restProps }, pathname);

  if (!match) {
    return null;
  }

  return match;
};

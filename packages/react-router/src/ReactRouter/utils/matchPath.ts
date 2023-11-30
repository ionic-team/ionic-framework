import { matchPath as reactRouterMatchPath } from 'react-router';

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
    from?: string;
    component?: any;
    exact?: boolean;
  };
}

/**
 * @see https://v5.reactrouter.com/web/api/matchPath
 */
export const matchPath = ({
  pathname,
  componentProps,
}: MatchPathOptions): false | ReturnType<typeof reactRouterMatchPath> => {
  const { exact, component } = componentProps;

  const path = componentProps.path || componentProps.from;
  /***
   * The props to match against, they are identical
   * to the matching props `Route` accepts. It could also be a string
   * or an array of strings as shortcut for `{ path }`.
   */
  const matchProps = {
    exact,
    path,
    component,
  };

  const match = reactRouterMatchPath(pathname, matchProps);

  if (!match) {
    return false;
  }

  return match;
};

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
  componentProps
}: MatchPathOptions): false | ReturnType<typeof reactRouterMatchPath> => {
  const { exact: caseSensitive, path, from } = componentProps;

  if (!pathname) {
    console.warn('Attempt to match path on an undefined pathname', {
      path: componentProps.path,
      from: componentProps.from,
    });
    // TODO @sean this is new behavior, need to debug where it is coming from
    return false;
  }

  const match = reactRouterMatchPath({
    path: path ?? from ?? '',
    caseSensitive
  }, pathname);

  if (!match) {
    return false;
  }

  return match;
};

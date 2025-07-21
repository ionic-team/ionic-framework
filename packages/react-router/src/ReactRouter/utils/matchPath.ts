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

  if (!path && !index) {
    console.warn('[Ionic] matchPath: No path prop provided. This will always return null.', {
      componentProps,
    });
    return null;
  }

  if (!path) {
    return reactRouterMatchPath({ path: '/', ...restProps, end: true }, pathname);
  }

  const match = reactRouterMatchPath({ path, ...restProps }, pathname);
  if (match) {
    console.log('--------------------------------');
    console.log(' Match found');
    console.log('--------------------------------');
    console.log('Path', path);
    console.log('Index', index);
    console.log('Pathname', pathname);
    console.log('Other props', restProps);
    console.log('Match', match);
    console.log('--------------------------------\n');
  }

  if (!match) {
    return null;
  }

  return match;
};

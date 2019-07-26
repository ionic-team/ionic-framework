import { RouteChain, RouterDirection } from '../../../interface';

import { ROUTER_INTENT_FORWARD } from './constants';

export const generatePath = (segments: string[]): string => {
  const path = segments
    .filter(s => s.length > 0)
    .join('/');

  return '/' + path;
};

export const chainToPath = (chain: RouteChain): string[] | null => {
  const path = [];
  for (const route of chain) {
    for (const segment of route.path) {
      if (segment[0] === ':') {
        const param = route.params && route.params[segment.slice(1)];
        if (!param) {
          return null;
        }
        path.push(param);
      } else if (segment !== '') {
        path.push(segment);
      }
    }
  }
  return path;
};

export const writePath = (history: History, root: string, useHash: boolean, path: string[], direction: RouterDirection, state: number) => {
  let url = generatePath([
    ...parsePath(root),
    ...path
  ]);
  if (useHash) {
    url = '#' + url;
  }
  if (direction === ROUTER_INTENT_FORWARD) {
    history.pushState(state, '', url);
  } else {
    history.replaceState(state, '', url);
  }
};

export const removePrefix = (prefix: string[], path: string[]): string[] | null => {
  if (prefix.length > path.length) {
    return null;
  }
  if (prefix.length <= 1 && prefix[0] === '') {
    return path;
  }
  for (let i = 0; i < prefix.length; i++) {
    if (prefix[i].length > 0 && prefix[i] !== path[i]) {
      return null;
    }
  }
  if (path.length === prefix.length) {
    return [''];
  }
  return path.slice(prefix.length);
};

export const readPath = (loc: Location, root: string, useHash: boolean): string[] | null => {
  let pathname = loc.pathname;
  if (useHash) {
    const hash = loc.hash;
    pathname = (hash[0] === '#')
      ? hash.slice(1)
      : '';
  }

  const prefix = parsePath(root);
  const path = parsePath(pathname);
  return removePrefix(prefix, path);
};

export const parsePath = (path: string | undefined | null): string[] => {
  if (path == null) {
    return [''];
  }
  const segments = path.split('/')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (segments.length === 0) {
    return [''];
  } else {
    return segments;
  }
};

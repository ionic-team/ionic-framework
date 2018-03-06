import { RouteChain } from './interfaces';

export function generatePath(segments: string[]): string {
  const path = segments
    .filter(s => s.length > 0)
    .join('/');

  return '/' + path;
}

export function chainToPath(chain: RouteChain): string[] {
  const path = [];
  for (const route of chain) {
    if (route.path[0] !== '') {
      path.push(...route.path);
    }
  }
  return path;
}

export function writePath(history: History, base: string, usePath: boolean, path: string[], isPop: boolean, state: number) {
  path = [base, ...path];
  let url = generatePath(path);
  if (usePath) {
    url = '#' + url;
  }
  state++;
  if (isPop) {
    history.back();
    history.replaceState(state, null, url);
  } else {
    history.pushState(state, null, url);
  }
  return state;
}

export function readPath(loc: Location, base: string, useHash: boolean): string[] | null {
  const path = useHash
    ? loc.hash.substr(1)
    : loc.pathname;

  if (path.startsWith(base)) {
    return parsePath(path.slice(base.length));
  }
  return null;
}

export function parsePath(path: string): string[] {
  if (path === null || path === undefined) {
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
}


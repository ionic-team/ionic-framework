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
    for (const segment of route.path) {
      if (segment[0] === ':') {
        const param = route.params && route.params[segment.slice(1)];
        if (!param) {
          throw new Error(`missing param ${segment.slice(1)}`);
        }
        path.push(param);
      } else if (segment !== '') {
        path.push(segment);
      }
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
  if (isPop) {
    // history.back();
    history.replaceState(state, null, url);
  } else {
    history.pushState(state, null, url);
  }
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


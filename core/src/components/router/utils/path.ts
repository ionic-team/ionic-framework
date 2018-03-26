import { RouteChain, RouterDirection } from './interfaces';

export function generatePath(segments: string[]): string {
  const path = segments
    .filter(s => s.length > 0)
    .join('/');

  return '/' + path;
}

export function chainToPath(chain: RouteChain): string[]|null {
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
}

export function writePath(history: History, base: string, usePath: boolean, path: string[], direction: RouterDirection, state: number) {
  path = [base, ...path];
  let url = generatePath(path);
  if (usePath) {
    url = '#' + url;
  }
  if (direction === RouterDirection.Forward) {
    history.pushState(state, '', url);
  } else {
    history.replaceState(state, '', url);
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

export function parsePath(path: string|null|undefined): string[] {
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
}


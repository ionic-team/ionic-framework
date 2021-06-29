import { RouteChain, RouteID, RouteRedirect } from './interface';

// Returns whether the given redirect matches the given path segments.
//
// A redirect matches when the segments of the path and redirect.from are equal.
// Note that segments are only checked until redirect.from contains a '*' which matches any path segment.
// The path ['some', 'path', 'to', 'page'] matches both ['some', 'path', 'to', 'page'] and ['some', 'path', '*'].
export const matchesRedirect = (path: string[], redirect: RouteRedirect): boolean => {
  const { from, to } = redirect;
  if (to === undefined) {
    return false;
  }

  if (from.length > path.length) {
    return false;
  }

  for (let i = 0; i < from.length; i++) {
    const expected = from[i];
    if (expected === '*') {
      return true;
    }
    if (expected !== path[i]) {
      return false;
    }
  }
  return from.length === path.length;
};

// Returns the first redirect matching the path segments or undefined when no match found.
export const findRouteRedirect = (path: string[], redirects: RouteRedirect[]) => {
  return redirects.find(redirect => matchesRedirect(path, redirect));
};

export const matchesIDs = (ids: string[], chain: RouteChain): number => {
  const len = Math.min(ids.length, chain.length);
  let i = 0;
  for (; i < len; i++) {
    if (ids[i].toLowerCase() !== chain[i].id) {
      break;
    }
  }
  return i;
};

export const matchesPath = (inputPath: string[], chain: RouteChain): RouteChain | null => {
  const segments = new RouterSegments(inputPath);
  let matchesDefault = false;
  let allparams: any[] | undefined;
  for (let i = 0; i < chain.length; i++) {
    const path = chain[i].path;
    if (path[0] === '') {
      matchesDefault = true;
    } else {
      for (const segment of path) {
        const data = segments.next();
        // data param
        if (segment[0] === ':') {
          if (data === '') {
            return null;
          }
          allparams = allparams || [];
          const params = allparams[i] || (allparams[i] = {});
          params[segment.slice(1)] = data;
        } else if (data !== segment) {
          return null;
        }
      }
      matchesDefault = false;
    }
  }
  const matches = (matchesDefault)
    ? matchesDefault === (segments.next() === '')
    : true;

  if (!matches) {
    return null;
  }
  if (allparams) {
    return chain.map((route, i) => ({
      id: route.id,
      path: route.path,
      params: mergeParams(route.params, allparams![i]),
      beforeEnter: route.beforeEnter,
      beforeLeave: route.beforeLeave
    }));
  }
  return chain;
};

// Merges the route parameter objects.
// Returns undefined when both parameters are undefined.
export const mergeParams = (a: {[key: string]: any} | undefined, b: {[key: string]: any} | undefined): {[key: string]: any} | undefined => {
  return a || b ? { ...a, ...b } : undefined;
};

export const routerIDsToChain = (ids: RouteID[], chains: RouteChain[]): RouteChain | null => {
  let match: RouteChain | null = null;
  let maxMatches = 0;
  const plainIDs = ids.map(i => i.id);
  for (const chain of chains) {
    const score = matchesIDs(plainIDs, chain);
    if (score > maxMatches) {
      match = chain;
      maxMatches = score;
    }
  }
  if (match) {
    return match.map((route, i) => ({
      id: route.id,
      path: route.path,
      params: mergeParams(route.params, ids[i] && ids[i].params)
    }));
  }
  return null;
};

export const routerPathToChain = (path: string[], chains: RouteChain[]): RouteChain | null => {
  let match: RouteChain | null = null;
  let matches = 0;
  for (const chain of chains) {
    const matchedChain = matchesPath(path, chain);
    if (matchedChain !== null) {
      const score = computePriority(matchedChain);
      if (score > matches) {
        matches = score;
        match = matchedChain;
      }
    }
  }
  return match;
};

export const computePriority = (chain: RouteChain): number => {
  let score = 1;
  let level = 1;
  for (const route of chain) {
    for (const path of route.path) {
      if (path[0] === ':') {
        score += Math.pow(1, level);
      } else if (path !== '') {
        score += Math.pow(2, level);
      }
      level++;
    }
  }
  return score;
};

export class RouterSegments {
  private path: string[];
  constructor(path: string[]) {
    this.path = path.slice();
  }

  next(): string {
    if (this.path.length > 0) {
      return this.path.shift() as string;
    }
    return '';
  }
}

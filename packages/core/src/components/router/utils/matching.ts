import { RouteChain, RouteID } from './interfaces';

export function matchesIDs(ids: string[], chain: RouteChain): number {
  const len = Math.min(ids.length, chain.length);
  let i = 0;
  for (; i < len; i++) {
    if (ids[i].toLowerCase() !== chain[i].id) {
      break;
    }
  }
  return i;
}

export function matchesPath(path: string[], chain: RouteChain): RouteChain | null {
  const segments = new RouterSegments(path);
  let matchesDefault = false;
  let allparams: any[];
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
      params: mergeParams(route.params, allparams[i])
    }));
  }
  return chain;
}

export function mergeParams(a: any, b: any): any {
  if (!a && b) {
    return b;
  } else if (a && !b) {
    return a;
  } else if (a && b) {
    return {
      ...a,
      ...b
    };
  }
  return undefined;
}


export function routerIDsToChain(ids: RouteID[], chains: RouteChain[]): RouteChain|null {
  let match: RouteChain|null = null;
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
}


export function routerPathToChain(path: string[], chains: RouteChain[]): RouteChain|null {
  let match: RouteChain = null;
  let matches = 0;
  for (const chain of chains) {
    const matchedChain = matchesPath(path, chain);
    if (matchedChain !== null) {
      if (matchedChain.length > matches) {
        matches = matchedChain.length;
        match = matchedChain;
      }
    }
  }
  return match;
}

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


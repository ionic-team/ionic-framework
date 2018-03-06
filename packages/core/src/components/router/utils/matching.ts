import { RouterSegments } from './common';
import { RouteChain, RouteMatch } from './interfaces';

export function matchesIDs(ids: string[], chain: RouteChain): number {
  const len = Math.min(ids.length, chain.length);
  let i = 0;
  for (; i < len; i++) {
    if (ids[i] !== chain[i].id) {
      break;
    }
  }
  return i;
}


export function matchesPath(path: string[], chain: RouteChain): boolean {
  const segments = new RouterSegments(path);
  let matchesDefault = false;
  for (let i = 0; i < chain.length; i++) {
    const route = chain[i];
    if (route.path[0] !== '') {
      for (const segment of route.path) {
        if (segments.next() !== segment) {
          return false;
        }
      }
      matchesDefault = false;
    } else {
      matchesDefault = true;
    }
  }
  if (matchesDefault) {
    return matchesDefault === segments.isDefault();
  }
  return true;
}


export function routerIDsToChain(ids: string[], chains: RouteChain[]): RouteMatch {
  let match: RouteChain|null = null;
  let maxMatches = 0;
  for (const chain of chains) {
    const score = matchesIDs(ids, chain);
    if (score > maxMatches) {
      match = chain;
      maxMatches = score;
    }
  }
  return {
    chain: match,
    matches: maxMatches,
  };
}


export function routerPathToChain(path: string[], chains: RouteChain[]): RouteMatch|null {
  let match: RouteChain = null;
  let matches = 0;
  for (const chain of chains) {
    if (matchesPath(path, chain)) {
      if (chain.length > matches) {
        matches = chain.length;
        match = chain;
      }
    }
  }
  return {
    chain: match,
    matches,
  };
}

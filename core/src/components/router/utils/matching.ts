import { WILDCARD_PARAM } from './constants';
import type { RouteChain, RouteID, RouteRedirect } from './interface';
import { chainToSegments, endsWithWildcard, withoutWildcard } from './path';

/**
 * Returns whether the given redirect matches the given path segments.
 *
 * A redirect matches when the segments of the path and redirect.from are equal.
 * Note that segments are only checked until redirect.from contains a '*' which matches any path segment.
 * The path ['some', 'path', 'to', 'page'] matches both ['some', 'path', 'to', 'page'] and ['some', 'path', '*'].
 */
export const matchesRedirect = (segments: string[], redirect: RouteRedirect): boolean => {
  const { from, to } = redirect;
  if (to === undefined) {
    return false;
  }

  if (from.length > segments.length) {
    return false;
  }

  for (let i = 0; i < from.length; i++) {
    const expected = from[i];
    if (expected === '*') {
      return true;
    }
    if (expected !== segments[i]) {
      return false;
    }
  }
  return from.length === segments.length;
};

/** Returns the first redirect matching the path segments or undefined when no match found. */
export const findRouteRedirect = (segments: string[], redirects: RouteRedirect[]) => {
  return redirects.find((redirect) => matchesRedirect(segments, redirect));
};

export const matchesIDs = (ids: Pick<RouteID, 'id' | 'params'>[], chain: RouteChain): number => {
  const len = Math.min(ids.length, chain.length);

  let score = 0;

  for (let i = 0; i < len; i++) {
    const routeId = ids[i];
    const routeChain = chain[i];
    // Skip results where the route id does not match the chain at the same index
    if (routeId.id.toLowerCase() !== routeChain.id) {
      break;
    }
    // Weight a wildcard route when the outlet reports its `pathMatch`
    if (routeId.params?.[WILDCARD_PARAM] !== undefined && endsWithWildcard(routeChain.segments)) {
      score++;
    }
    if (routeId.params) {
      const routeIdParams = Object.keys(routeId.params);
      // Only compare routes with the chain that have the same number of parameters.
      if (routeIdParams.length === routeChain.segments.length) {
        // Maps the route's params into a path based on the path variable names,
        // to compare against the route chain format.
        //
        // Before:
        // ```ts
        // {
        //  params: {
        //    s1: 'a',
        //    s2: 'b'
        //  }
        // }
        // ```
        //
        // After:
        // ```ts
        // [':s1',':s2']
        // ```
        //
        const pathWithParams = routeIdParams.map((key) => `:${key}`);
        for (let j = 0; j < pathWithParams.length; j++) {
          // Skip results where the path variable is not a match
          if (pathWithParams[j].toLowerCase() !== routeChain.segments[j]) {
            break;
          }
          // Weight path matches for the same index higher.
          score++;
        }
      }
    }
    // Weight id matches
    score++;
  }
  return score;
};

/**
 * Matches the segments against the chain.
 *
 * Returns:
 * - null when there is no match,
 * - a chain with the params properties updated with the parameter segments on match.
 */
export const matchesSegments = (segments: string[], chain: RouteChain): RouteChain | null => {
  const inputSegments = new RouterSegments(segments);
  let matchesDefault = false;
  let allparams: any[] | undefined;
  for (let i = 0; i < chain.length; i++) {
    const chainSegments = chain[i].segments;
    if (chainSegments[0] === '') {
      matchesDefault = true;
    } else {
      const params: { [key: string]: any } = {};
      for (const segment of withoutWildcard(chainSegments)) {
        const data = inputSegments.next();
        // data param
        if (segment[0] === ':') {
          if (data === '') {
            return null;
          }
          params[segment.slice(1)] = data;
        } else if (data !== segment) {
          return null;
        }
      }
      // A trailing `*` on a parent route has no effect. Its children match the rest of the path.
      if (i === chain.length - 1 && endsWithWildcard(chainSegments)) {
        params[WILDCARD_PARAM] = inputSegments.rest().join('/');
      }
      if (Object.keys(params).length > 0) {
        allparams = allparams || [];
        allparams[i] = params;
      }
      matchesDefault = false;
    }
  }
  const matches = matchesDefault ? matchesDefault === (inputSegments.next() === '') : true;

  if (!matches) {
    return null;
  }
  if (allparams) {
    return chain.map((route, i) => ({
      id: route.id,
      segments: route.segments,
      params: mergeParams(route.params, allparams![i]),
      beforeEnter: route.beforeEnter,
      beforeLeave: route.beforeLeave,
    }));
  }
  return chain;
};

/**
 * Merges the route parameter objects.
 * Returns undefined when both parameters are undefined.
 */
export const mergeParams = (
  a: { [key: string]: any } | undefined,
  b: { [key: string]: any } | undefined
): { [key: string]: any } | undefined => {
  return a || b ? { ...a, ...b } : undefined;
};

/**
 * Finds the best match for the ids in the chains.
 *
 * Returns the best match or null when no match is found.
 * When a chain is returned the parameters are updated from the RouteIDs.
 * That is they contain both the componentProps of the <ion-route> and the parameter segment.
 *
 * When a wildcard route ties with other routes, a route without a wildcard that can build a url wins,
 * then the wildcard route. Otherwise the first route declared wins a tie.
 */
export const findChainForIDs = (ids: RouteID[], chains: RouteChain[]): RouteChain | null => {
  let maxMatches = 0;
  let tied: RouteChain[] = [];

  for (const chain of chains) {
    const score = matchesIDs(ids, chain);
    if (score > maxMatches) {
      maxMatches = score;
      tied = [chain];
    } else if (score > 0 && score === maxMatches) {
      tied.push(chain);
    }
  }
  const matches = tied.map((chain) =>
    chain.map((route, i) => ({
      id: route.id,
      segments: route.segments,
      params: mergeParams(route.params, ids[i]?.params),
    }))
  );
  if (!matches.some(chainEndsWithWildcard)) {
    return matches.length > 0 ? matches[0] : null;
  }
  return matches.reduce((best, chain) => (tieRank(chain) > tieRank(best) ? chain : best));
};

const tieRank = (chain: RouteChain): number => {
  if (chainEndsWithWildcard(chain)) {
    return 1;
  }
  return chainToSegments(chain) !== null ? 2 : 0;
};

/**
 * Finds the best match for the segments in the chains.
 *
 * Returns the best match or null when no match is found.
 * When a chain is returned the parameters are updated from the segments.
 * That is they contain both the componentProps of the <ion-route> and the parameter segments.
 *
 * When wildcard routes match, the one with the most fixed segments wins if it has more fixed segments than every
 * route that matched the whole path. Routes that only matched by ignoring trailing segments don't count.
 */
export const findChainForSegments = (segments: string[], chains: RouteChain[]): RouteChain | null => {
  let match: RouteChain | null = null;
  let bestScore = 0;
  let fullMatch: RouteChain | null = null;
  let bestFullScore = 0;
  let maxFullFixed = -1;
  let wildcard: RouteChain | null = null;
  for (const chain of chains) {
    const matchedChain = matchesSegments(segments, chain);
    if (matchedChain !== null) {
      const score = computePriority(matchedChain);
      if (score > bestScore) {
        bestScore = score;
        match = matchedChain;
      }
      if (chainEndsWithWildcard(matchedChain)) {
        if (wildcard === null || winsWildcard(matchedChain, wildcard)) {
          wildcard = matchedChain;
        }
      } else if (!isPartialMatch(segments, matchedChain)) {
        if (score > bestFullScore) {
          bestFullScore = score;
          fullMatch = matchedChain;
        }
        maxFullFixed = Math.max(maxFullFixed, countFixedSegments(matchedChain));
      }
    }
  }
  // Without a wildcard to match the rest of the path, routes can still ignore trailing segments.
  if (wildcard === null) {
    return match;
  }
  // Compare fixed segments rather than priority, since nesting under default routes raises the priority
  return countFixedSegments(wildcard) > maxFullFixed ? wildcard : fullMatch;
};

/** Returns whether the chain matched the path segments only by ignoring some trailing segments. */
const isPartialMatch = (segments: string[], chain: RouteChain): boolean => {
  const matched = chainToSegments(chain);
  return matched !== null && matched.length < segments.filter((s) => s !== '').length;
};

const chainEndsWithWildcard = (chain: RouteChain): boolean => {
  return endsWithWildcard(chain[chain.length - 1].segments);
};

/** Returns whether the wildcard chain beats `best` by fixed segments, then by priority. */
const winsWildcard = (chain: RouteChain, best: RouteChain): boolean => {
  const chainFixed = countFixedSegments(chain);
  const bestFixed = countFixedSegments(best);
  return chainFixed > bestFixed || (chainFixed === bestFixed && computePriority(chain) > computePriority(best));
};

const countFixedSegments = (chain: RouteChain): number => {
  let count = 0;
  for (const route of chain) {
    for (const segment of withoutWildcard(route.segments)) {
      if (segment !== '' && segment[0] !== ':') {
        count++;
      }
    }
  }
  return count;
};

/**
 * Computes the priority of a chain.
 *
 * Parameter segments are given a lower priority over fixed segments.
 *
 * Considering the following 2 chains matching the path /path/to/page:
 * - /path/to/:where
 * - /path/to/page
 *
 * The second one will be given a higher priority because "page" is a fixed segment (vs ":where", a parameter segment).
 *
 * A trailing wildcard is not counted.
 */
export const computePriority = (chain: RouteChain): number => {
  let score = 1;
  let level = 1;
  for (const route of chain) {
    for (const segment of withoutWildcard(route.segments)) {
      if (segment[0] === ':') {
        score += Math.pow(1, level);
      } else if (segment !== '') {
        score += Math.pow(2, level);
      }
      level++;
    }
  }
  return score;
};

export class RouterSegments {
  private segments: string[];
  constructor(segments: string[]) {
    this.segments = segments.slice();
  }

  next(): string {
    if (this.segments.length > 0) {
      return this.segments.shift() as string;
    }
    return '';
  }

  /** Consumes and returns the remaining non empty segments. */
  rest(): string[] {
    const rest = this.segments.filter((s) => s !== '');
    this.segments = [];
    return rest;
  }
}

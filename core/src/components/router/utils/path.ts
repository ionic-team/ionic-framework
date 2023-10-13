import { ROUTER_INTENT_FORWARD } from './constants';
import type { ParsedRoute, RouteChain, RouterDirection } from './interface';

/** Join the non empty segments with "/". */
export const generatePath = (segments: string[]): string => {
  const path = segments.filter((s) => s.length > 0).join('/');

  return '/' + path;
};

const generateUrl = (segments: string[], useHash: boolean, queryString?: string) => {
  let url = generatePath(segments);
  if (useHash) {
    url = '#' + url;
  }
  if (queryString !== undefined) {
    url += '?' + queryString;
  }
  return url;
};

export const writeSegments = (
  history: History,
  root: string,
  useHash: boolean,
  segments: string[],
  direction: RouterDirection,
  state: number,
  queryString?: string
) => {
  const url = generateUrl([...parsePath(root).segments, ...segments], useHash, queryString);
  if (direction === ROUTER_INTENT_FORWARD) {
    history.pushState(state, '', url);
  } else {
    history.replaceState(state, '', url);
  }
};

/**
 * Transforms a chain to a list of segments.
 *
 * Notes:
 * - parameter segments of the form :param are replaced with their value,
 * - null is returned when a value is missing for any parameter segment.
 */
export const chainToSegments = (chain: RouteChain): string[] | null => {
  const segments = [];
  for (const route of chain) {
    for (const segment of route.segments) {
      if (segment[0] === ':') {
        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        const param = route.params && route.params[segment.slice(1)];
        if (!param) {
          return null;
        }
        segments.push(param);
      } else if (segment !== '') {
        segments.push(segment);
      }
    }
  }
  return segments;
};

/**
 * Removes the prefix segments from the path segments.
 *
 * Return:
 * - null when the path segments do not start with the passed prefix,
 * - the path segments after the prefix otherwise.
 */
const removePrefix = (prefix: string[], segments: string[]): string[] | null => {
  if (prefix.length > segments.length) {
    return null;
  }
  if (prefix.length <= 1 && prefix[0] === '') {
    return segments;
  }
  for (let i = 0; i < prefix.length; i++) {
    if (prefix[i] !== segments[i]) {
      return null;
    }
  }
  if (segments.length === prefix.length) {
    return [''];
  }
  return segments.slice(prefix.length);
};

export const readSegments = (loc: Location, root: string, useHash: boolean): string[] | null => {
  const prefix = parsePath(root).segments;
  const pathname = useHash ? loc.hash.slice(1) : loc.pathname;
  const segments = parsePath(pathname).segments;
  return removePrefix(prefix, segments);
};

/**
 * Parses the path to:
 * - segments an array of '/' separated parts,
 * - queryString (undefined when no query string).
 */
export const parsePath = (path: string | undefined | null): ParsedRoute => {
  let segments = [''];
  let queryString;

  if (path != null) {
    const qsStart = path.indexOf('?');
    if (qsStart > -1) {
      queryString = path.substring(qsStart + 1);
      path = path.substring(0, qsStart);
    }

    segments = path
      .split('/')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (segments.length === 0) {
      segments = [''];
    }
  }

  return { segments, queryString };
};

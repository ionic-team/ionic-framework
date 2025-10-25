/**
 * Determines the portion of a pathname that a given route pattern should match against.
 * For absolute route patterns we return the full pathname. For relative patterns we
 * strip off the already-matched parent segments so React Router receives the remainder.
 */
export const derivePathnameToMatch = (fullPathname: string, routePath?: string): string => {
  if (!routePath || routePath === '' || routePath.startsWith('/')) {
    return fullPathname;
  }

  const trimmedPath = fullPathname.startsWith('/') ? fullPathname.slice(1) : fullPathname;
  if (!trimmedPath) {
    return '';
  }

  const fullSegments = trimmedPath.split('/').filter(Boolean);
  if (fullSegments.length === 0) {
    return '';
  }

  const routeSegments = routePath.split('/').filter(Boolean);
  if (routeSegments.length === 0) {
    return trimmedPath;
  }

  const wildcardIndex = routeSegments.findIndex((segment) => segment === '*' || segment === '**');

  if (wildcardIndex >= 0) {
    const baseSegments = routeSegments.slice(0, wildcardIndex);
    if (baseSegments.length === 0) {
      return trimmedPath;
    }

    const startIndex = fullSegments.findIndex((_, idx) =>
      baseSegments.every((seg, segIdx) => {
        const target = fullSegments[idx + segIdx];
        if (!target) {
          return false;
        }
        if (seg.startsWith(':')) {
          return true;
        }
        return target === seg;
      })
    );

    if (startIndex >= 0) {
      return fullSegments.slice(startIndex).join('/');
    }
  }

  if (routeSegments.length <= fullSegments.length) {
    return fullSegments.slice(fullSegments.length - routeSegments.length).join('/');
  }

  return fullSegments[fullSegments.length - 1] ?? trimmedPath;
};


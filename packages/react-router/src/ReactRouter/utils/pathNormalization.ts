/**
 * Ensures the given path has a leading slash.
 *
 * @param value The path string to normalize.
 * @returns The path with a leading slash.
 */
export const ensureLeadingSlash = (value: string): string => {
  if (value === '') {
    return '/';
  }
  return value.startsWith('/') ? value : `/${value}`;
};

/**
 * Strips the trailing slash from a path, unless it's the root path.
 *
 * @param value The path string to normalize.
 * @returns The path without a trailing slash.
 */
export const stripTrailingSlash = (value: string): string => {
  return value.length > 1 && value.endsWith('/') ? value.slice(0, -1) : value;
};

/**
 * Normalizes a pathname for comparison by ensuring a leading slash
 * and removing trailing slashes.
 *
 * @param value The pathname to normalize, can be undefined.
 * @returns A normalized pathname string.
 */
export const normalizePathnameForComparison = (value: string | undefined): string => {
  if (!value || value === '') {
    return '/';
  }
  const withLeadingSlash = ensureLeadingSlash(value);
  return stripTrailingSlash(withLeadingSlash);
};

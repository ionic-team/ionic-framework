/**
 * Returns `true` if the direction resolves to `rtl` for the given element.
 *
 * The direction comes from the nearest ancestor that declares one, starting
 * with `hostEl` itself, and falls back to the root document value. Setting
 * `dir="auto"` or setting `dir` to an empty string are skipped rather than
 * treated as `ltr`. When nothing declares a direction, including the document,
 * the direction is `ltr`.
 *
 * @param hostEl the element to resolve the direction for.
 */
export const isRTL = (hostEl?: Element | null): boolean => {
  for (let el = hostEl; el; el = el.parentElement) {
    const dir = el.getAttribute('dir')?.toLowerCase();

    if (dir === 'rtl') {
      return true;
    }
    if (dir === 'ltr') {
      return false;
    }
  }
  return document?.dir?.toLowerCase() === 'rtl';
};

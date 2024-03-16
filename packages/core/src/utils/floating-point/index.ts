export function getDecimalPlaces(n: number) {
  if (n % 1 === 0) return 0;
  return n.toString().split('.')[1].length;
}

/**
 * Fixes floating point rounding errors in a result by rounding
 * to the same specificity, or number of decimal places (*not*
 * significant figures) as provided reference numbers. If multiple
 * references are provided, the highest number of decimal places
 * between them will be used.
 *
 * The main use case is when numbers x and y are added to produce n,
 * but x and y are floats, so n may have rounding errors (such as
 * 3.1000000004 instead of 3.1). As long as only addition/subtraction
 * occurs between x and y, the specificity of the result will never
 * increase, so x and y should be passed in as the references.
 *
 * If multiplication, division, or other operations were used to
 * calculate n, the rounded result may have less specificity than
 * desired. For example, 1 / 3 = 0.33333(...), but
 * roundToMaxDecimalPlaces((1 / 3), 1, 3) will return 0, since both
 * 1 and 3 are whole numbers.
 *
 * Note that extremely precise reference numbers may lead to rounding
 * errors not being trimmed, due to the error result having the same or
 * fewer decimal places as the reference(s). This is acceptable as we
 * would not be able to tell the difference between a rounding error
 * and correct value in this case, but it does mean there is an implicit
 * precision limit. If precision that high is needed, it is recommended
 * to use a third party data type designed to handle floating point
 * errors instead.
 *
 * @param n The number to round.
 * @param references Number(s) used to calculate n, or that should otherwise
 * be used as a reference for the desired specificity.
 */
export function roundToMaxDecimalPlaces(n: number, ...references: number[]) {
  const maxPlaces = Math.max(...references.map((r) => getDecimalPlaces(r)));
  return Number(n.toFixed(maxPlaces));
}

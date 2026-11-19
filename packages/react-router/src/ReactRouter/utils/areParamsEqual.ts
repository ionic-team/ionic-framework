export type RouteParams = Record<string, string | string[] | undefined>;

/**
 * Compares two route param objects by value, treating a missing object as empty.
 */
export const areParamsEqual = (a?: RouteParams, b?: RouteParams): boolean => {
  const paramsA = a || {};
  const paramsB = b || {};
  const keysA = Object.keys(paramsA);
  const keysB = Object.keys(paramsB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every((key) => {
    const valueA = paramsA[key];
    const valueB = paramsB[key];
    if (Array.isArray(valueA) && Array.isArray(valueB)) {
      if (valueA.length !== valueB.length) {
        return false;
      }
      return valueA.every((entry, idx) => entry === valueB[idx]);
    }
    return valueA === valueB;
  });
};

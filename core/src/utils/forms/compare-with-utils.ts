type CompareFn = (currentValue: any, compareValue: any) => boolean;

export const compareOptions = (
  currentValue: any,
  compareValue: any,
  compareWith?: string | CompareFn | null
): boolean => {
  if (typeof compareWith === 'function') {
    return compareWith(currentValue, compareValue);
  } else if (typeof compareWith === 'string') {
    return currentValue[compareWith] === compareValue[compareWith];
  } else {
    return Array.isArray(compareValue) ? compareValue.includes(currentValue) : currentValue === compareValue;
  }
};

/**
 * Compares a value against the current value to determine if it is selected.
 *
 * @param currentValue The current value of the control.
 * @param compareValue The value to compare against.
 * @param compareWith The function to use to compare values.
 */
export const isOptionSelected = (
  currentValue: any[] | any,
  compareValue: any,
  compareWith?: string | CompareFn | null
) => {
  if (currentValue === undefined) {
    return false;
  }
  if (Array.isArray(currentValue)) {
    return currentValue.some((val) => compareOptions(val, compareValue, compareWith));
  } else {
    return compareOptions(currentValue, compareValue, compareWith);
  }
};

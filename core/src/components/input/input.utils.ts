import { printIonError } from '@utils/logging';

export const getCounterText = (
  value:
    | string
    | number
    | null
    | undefined,
  maxLength: number,
  counterFormatter?: (
    inputLength: number,
    maxLength: number
  ) => string
) => {
  const valueLength =
    value == null
      ? 0
      : value.toString().length;
  const defaultCounterText =
    defaultCounterFormatter(
      valueLength,
      maxLength
    );

  /**
   * If developers did not pass a custom formatter,
   * use the default one.
   */
  if (counterFormatter === undefined) {
    return defaultCounterText;
  }

  /**
   * Otherwise, try to use the custom formatter
   * and fallback to the default formatter if
   * there was an error.
   */
  try {
    return counterFormatter(
      valueLength,
      maxLength
    );
  } catch (e) {
    printIonError(
      'Exception in provided `counterFormatter`.',
      e
    );
    return defaultCounterText;
  }
};

const defaultCounterFormatter = (
  length: number,
  maxlength: number
) => {
  return `${length} / ${maxlength}`;
};

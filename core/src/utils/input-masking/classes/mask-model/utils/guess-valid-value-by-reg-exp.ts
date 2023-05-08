import type { ElementState } from '../../../types/mask-interface';

/**
 * Attempts to guess a valid input value by matching the value against a mask regular expression.
 *
 * @param elementState - An object containing the current input value and selection range.
 * @param maskRegExp - A regular expression used to validate the input value.
 * @returns An element state object containing a potentially valid input value and updated selection range.
 */
export function guessValidValueByRegExp({ value, selection }: ElementState, maskRegExp: RegExp): ElementState {
  const [from, to] = selection;
  let newFrom = from;
  let newTo = to;

  // Checks the value one character at a time against the mask regular expression.
  const validatedValue = Array.from(value).reduce((validatedValuePart, char, i) => {
    const newPossibleValue = validatedValuePart + char;

    if (from === i) {
      newFrom = validatedValuePart.length;
    }

    if (to === i) {
      newTo = validatedValuePart.length;
    }

    return newPossibleValue.match(maskRegExp)
      ? // If the new possible value matches the mask regular expression, then we return it.
        newPossibleValue
      : // Otherwise, we return the previous validated value part.
        validatedValuePart;
  }, '');

  // Return a new element state with the valid value and updated selection range.
  return { value: validatedValue, selection: [newFrom, newTo] };
}

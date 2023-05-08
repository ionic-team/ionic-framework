import type { ElementState } from '../../../types/mask-interface';

import { getLeadingFixedCharacters } from './get-leading-fixed-characters';
import { isFixedCharacter } from './is-fixed-character';
import { validateValueWithMask } from './validate-value-with-mask';

/**
 * Attempts to guess a valid input value by matching the input against a mask pattern.
 *
 * @param elementState - An object containing the current input value and selection range.
 * @param mask - An array of mask constraints, where each constraint can be either a string or a regular expression.
 * @param initialElementState - The initial state of the input element, containing the original value and selection range.
 * @returns An element state object containing a potentially valid input value and updated selection range.
 */
export function guessValidValueByPattern(
  elementState: ElementState,
  mask: (RegExp | string)[],
  initialElementState: ElementState | null
): ElementState {
  let maskedFrom: number | null = null;
  let maskedTo: number | null = null;

  const maskedValue = Array.from(elementState.value).reduce((validatedCharacters, char, charIndex) => {
    // Leading fixed characters may be a + or - sign, or a prefix like $.
    const leadingFixedCharacters = getLeadingFixedCharacters(mask, validatedCharacters, char, initialElementState);
    const newValidatedChars = validatedCharacters + leadingFixedCharacters;
    const charConstraint = mask[newValidatedChars.length];

    if (isFixedCharacter(charConstraint)) {
      // If the character constraint is a fixed character, then we don't need to check it.
      return newValidatedChars + charConstraint;
    }

    if (!char.match(charConstraint)) {
      return newValidatedChars;
    }

    if (maskedFrom === null && charIndex >= elementState.selection[0]) {
      maskedFrom = newValidatedChars.length;
    }

    if (maskedTo === null && charIndex >= elementState.selection[1]) {
      maskedTo = newValidatedChars.length;
    }

    return newValidatedChars + char;
  }, '');

  // Get the trailing fixed characters to add to the potentially valid value.
  const trailingFixedCharacters = getLeadingFixedCharacters(mask, maskedValue, '', initialElementState);

  // Return a new element state with the updated value and selection.
  return {
    value: validateValueWithMask(maskedValue + trailingFixedCharacters, mask)
      ? maskedValue + trailingFixedCharacters
      : maskedValue,
    selection: [maskedFrom ?? maskedValue.length, maskedTo ?? maskedValue.length],
  };
}

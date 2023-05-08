import type { ElementState } from '../../../types/mask-interface';

import { isFixedCharacter } from './is-fixed-character';

/**
 * Returns a string of fixed characters from the beginning of the mask.
 *
 * @param mask - An array of mask constraints, where each constraint can be either a string or a regular expression.
 * @param validatedValuePart - The part of the input value that has already been validated against the mask.
 * @param newCharacter - The new character being added to the input value.
 * @param initialElementState - The initial state of the input element, containing the original value and selection range.
 * @returns A string of fixed characters from the beginning of the mask.
 */
export function getLeadingFixedCharacters(
  mask: (RegExp | string)[],
  validatedValuePart: string,
  newCharacter: string,
  initialElementState: ElementState | null
): string {
  let leadingFixedCharacters = '';

  for (let i = validatedValuePart.length; i < mask.length; i++) {
    const charConstraint = mask[i];
    // Check if the character constraint exists in the initial element state.
    const isInitiallyExisted = initialElementState?.value[i] === charConstraint;

    if (!isFixedCharacter(charConstraint) || (charConstraint === newCharacter && !isInitiallyExisted)) {
      return leadingFixedCharacters;
    }

    leadingFixedCharacters += charConstraint;
  }

  return leadingFixedCharacters;
}

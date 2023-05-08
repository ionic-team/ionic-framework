import type { ElementState, MaskExpression } from '../../../types/mask-interface';

import { isFixedCharacter } from './is-fixed-character';

/**
 * Removes all fixed characters from the value of the given element state.
 * A fixed character is a character in the mask that is not allowed to change.
 * @param initialElementState The initial element state containing the value and the selection.
 * @param mask The mask expression defining the fixed and variable characters allowed at each position of the value.
 * @returns A new element state with the unmasked value and updated selection indices.
 */
export function removeFixedMaskCharacters(initialElementState: ElementState, mask: MaskExpression): ElementState {
  // If a mask is not an array, it cannot contain fixed characters.
  if (!Array.isArray(mask)) {
    return initialElementState;
  }

  // Get the start and end indices of the selection.
  const [from, to] = initialElementState.selection;
  const selection: number[] = [];

  // Loop over each character in the initial value and remove all fixed characters.
  const unmaskedValue = Array.from(initialElementState.value).reduce((rawValue, char, i) => {
    const charConstraint = mask[i];

    // Add selection index to array if the character is at the start or end of the selection.
    if (i === from) {
      selection.push(rawValue.length);
    }

    if (i === to) {
      selection.push(rawValue.length);
    }

    // Add character to the unmasked value if it is not a fixed character or does not match a mask constraint.
    return isFixedCharacter(charConstraint) && charConstraint === char ? rawValue : rawValue + char;
  }, '');

  // Append the length of the unmasked value to the selection array if it has less than two values.
  if (selection.length < 2) {
    selection.push(...Array(2 - selection.length).fill(unmaskedValue.length));
  }

  // Return the new element state with the unmasked value and updated selection indices.
  return {
    value: unmaskedValue,
    selection: [selection[0], selection[1]],
  };
}

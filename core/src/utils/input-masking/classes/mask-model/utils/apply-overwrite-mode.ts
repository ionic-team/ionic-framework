import type { ElementState, MaskOptions, SelectionRange } from '../../../types/mask-interface';

/**
 * Applies the specified overwrite mode to the selection range within the given element state.
 *
 * @param elementState - An object containing the current input value and selection range.
 * @param newCharacters - The string of new characters to insert into the input value.
 * @param mode - The overwrite mode to apply. This can be either a string ('replace' or 'preserve'), or a function that takes the element state as input and returns a string.
 * @returns A new element state object with the updated selection range based on the overwrite mode.
 */
export function applyOverwriteMode(
  { value, selection }: ElementState,
  newCharacters: string,
  mode: MaskOptions['overwriteMode']
): ElementState {
  const [from, to] = selection;

  // Compute the overwrite mode based on the mode argument
  const computedMode = typeof mode === 'function' ? mode({ value, selection }) : mode;

  // Determine the updated selection range based on the overwrite mode.
  const newSelection: SelectionRange = computedMode === 'replace' ? [from, from + newCharacters.length] : [from, to];

  // Return a new element state object with the updated selection range
  return {
    value,
    selection: newSelection,
  };
}

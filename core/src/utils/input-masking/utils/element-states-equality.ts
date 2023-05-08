import type { ElementState } from '../types/mask-interface';

/**
 * Checks if the values of the given states are equal.
 * @param sampleState The state to compare with.
 * @param states The states to compare.
 * @returns `true` if the values of the given states are equal, `false` otherwise.
 */
export function areElementValuesEqual(sampleState: ElementState, ...states: ElementState[]): boolean {
  return states.every(({ value }) => value === sampleState.value);
}

/**
 * Checks if the states are equal (value and selection).
 * @param sampleState The state to compare with.
 * @param states The states to compare.
 * @returns `true` if the states are equal, `false` otherwise.
 */
export function areElementStatesEqual(sampleState: ElementState, ...states: ElementState[]): boolean {
  return states.every(
    ({ value, selection }) =>
      value === sampleState.value &&
      selection[0] === sampleState.selection[0] &&
      selection[1] === sampleState.selection[1]
  );
}

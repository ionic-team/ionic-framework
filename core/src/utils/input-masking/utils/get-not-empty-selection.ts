import type { ElementState, SelectionRange } from '../types/mask-interface';

/**
 * Returns a selection that is not empty from the given element state.
 * @param elementState The element state to get the selection from.
 * @param isForward Whether the selection is forward or not.
 * @returns The non-empty selection.
 */
export function getNotEmptySelection({ value, selection }: ElementState, isForward: boolean): SelectionRange {
  const [from, to] = selection;

  if (from !== to) {
    return [from, to];
  }

  const notEmptySelection = isForward ? [from, to + 1] : [from - 1, to];

  return notEmptySelection.map((index) => Math.min(Math.max(index, 0), value.length)) as [number, number];
}

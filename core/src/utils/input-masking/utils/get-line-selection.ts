import type { ElementState, SelectionRange } from "../types/mask-interface";

export function getLineSelection(
  { value, selection }: ElementState,
  isForward: boolean,
): SelectionRange {
  const [from, to] = selection;

  if (from !== to) {
    return [from, to];
  }

  const nearestBreak = isForward
    ? value.slice(from).indexOf('\n') + 1 || value.length
    : value.slice(0, to).lastIndexOf('\n') + 1;

  const selectFrom = isForward ? from : nearestBreak;
  const selectTo = isForward ? nearestBreak : to;

  return [selectFrom, selectTo];
}

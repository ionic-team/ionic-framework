import type { ElementState, MaskExpression } from '../../../types/mask-interface';

import { guessValidValueByPattern } from './guess-valid-value-by-pattern';
import { guessValidValueByRegExp } from './guess-valid-value-by-reg-exp';
import { validateValueWithMask } from './validate-value-with-mask';

export function calibrateValueByMask(
  elementState: ElementState,
  mask: MaskExpression,
  initialElementState: ElementState | null = null
): ElementState {
  if (validateValueWithMask(elementState.value, mask)) {
    // If the value is valid with the mask, then we don't need to calibrate it.
    return elementState;
  }

  const { value, selection } = Array.isArray(mask)
    ? guessValidValueByPattern(elementState, mask, initialElementState)
    : guessValidValueByRegExp(elementState, mask);

  return {
    selection,
    value: Array.isArray(mask) ? value.slice(0, mask.length) : value,
  };
}

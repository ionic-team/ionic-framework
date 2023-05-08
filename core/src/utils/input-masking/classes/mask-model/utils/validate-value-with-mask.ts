import type { MaskExpression } from '../../../types/mask-interface';

import { isFixedCharacter } from './is-fixed-character';

/**
 * Validates the given value with the given mask expression.
 * @param value The value to validate.
 * @param maskExpression The mask expression to validate the value with.
 * @returns `true` if the given value is valid with the given mask expression, `false` otherwise.
 */
export function validateValueWithMask(value: string, maskExpression: MaskExpression): boolean {
  if (Array.isArray(maskExpression)) {
    /**
     * If the mask expression is an array, check if the the length of the value matches the length of the mask,
     * and if each character in the values matches the corresponding mask constraint.
     */
    return (
      value.length === maskExpression.length &&
      Array.from(value).every((char, i) => {
        const charConstraint = maskExpression[i];

        return isFixedCharacter(charConstraint) ? char === charConstraint : char.match(charConstraint);
      })
    );
  }
  // If the mask expression is a regular expression, test whether the value matches the expression.
  return maskExpression.test(value);
}

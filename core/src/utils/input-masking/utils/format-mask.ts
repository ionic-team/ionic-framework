import { printIonError } from '@utils/logging';

import type { MaskExpression } from '../public-api';

/**
 * Formats a mask expression into a supported format.
 * @param mask The mask to format.
 * @returns The formatted mask.
 */
export function formatMask(mask: string | MaskExpression): MaskExpression | null {
  if (typeof mask === 'string') {
    try {
      /**
       * Incoming masks can be a string, representing a regular expression.
       * If it is, we need to convert it to a RegExp object.
       *
       * e.g.: 'a' => /a/
       */
      return new RegExp(mask);
    } catch (error) {
      printIonError('Failed to format mask.', error);
      return null;
    }
  }
  return mask;
}

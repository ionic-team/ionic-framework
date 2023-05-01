import type { MaskFormat } from '../public-api';
import type { MaskExpression } from '../types/mask-interface';

/**
 * Formats the mask between the consumer API format and the internal
 * library format.
 * @param mask The mask to format.
 * @returns The formatted mask.
 */
export const formatMask = (mask: MaskFormat): MaskExpression | null => {
  if (typeof mask === 'string') {
    return new RegExp(mask);
  }
  if (Array.isArray(mask)) {
    return mask;
  }
  return null;
};

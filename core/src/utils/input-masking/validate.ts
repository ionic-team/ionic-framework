import { printIonWarning } from '@utils/logging';

import type { MaskFormat, MaskPlaceholder } from './input-masking-interface';

function validateMaskMaxLength(maxLength: number | undefined, mask: MaskFormat | undefined) {
  if (maxLength !== undefined && mask !== undefined) {
    printIonWarning('maxlength property should not be used with masking. Use a mask that has a fixed length instead.');
    return false;
  }
  return true;
}

function validateMaskPlaceholder(maskPlaceholder: MaskPlaceholder, mask: MaskFormat | undefined) {
  if (mask !== undefined && maskPlaceholder !== undefined) {
    if (maskPlaceholder?.length !== 1 && maskPlaceholder?.length !== mask.length) {
      printIonWarning('maskPlaceholder should either be a single character or have the same length as the mask.');
      return false;
    }
  }
  return true;
}

export { validateMaskMaxLength, validateMaskPlaceholder };

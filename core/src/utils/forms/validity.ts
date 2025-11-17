// TODO this file is going to cause conflicts once it updates from main

export const getValidityFlags = (validity: ValidityState): ValidityStateFlags => {
  return {
    badInput: validity.badInput,
    customError: validity.customError,
    patternMismatch: validity.patternMismatch,
    rangeOverflow: validity.rangeOverflow,
    rangeUnderflow: validity.rangeUnderflow,
    stepMismatch: validity.stepMismatch,
    tooLong: validity.tooLong,
    tooShort: validity.tooShort,
    typeMismatch: validity.typeMismatch,
    valueMissing: validity.valueMissing,
  };
};

/**
 * Reports the validity state of a native form element to ElementInternals.
 * This delegates to the native element's built-in validation, which automatically
 * handles required, minlength, maxlength, and other constraints.
 */
export const reportValidityToElementInternals = (
  nativeElement: HTMLInputElement | HTMLTextAreaElement | null | undefined,
  internals: ElementInternals
): void => {
  if (!nativeElement?.validity) {
    return;
  }

  if (nativeElement.validity.valid) {
    internals.setValidity({});
  } else {
    const validityFlags = getValidityFlags(nativeElement.validity);
    internals.setValidity(validityFlags, nativeElement.validationMessage, nativeElement);
  }
};

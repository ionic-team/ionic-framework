import { printIonError } from '@utils/logging';

export const getCounterText = (
  inputEl: HTMLIonInputElement,
  counterFormatter?: (inputLength: number, maxLength: number) => string
) => {
  const length = inputEl?.value?.toString().length ?? 0;

  if (counterFormatter === undefined) {
    return defaultCounterFormatter(length, inputEl.maxlength!);
  } else {
    try {
      return counterFormatter(length, inputEl.maxlength!);
    } catch (e) {
      printIonError('Exception in provided `counterFormatter`.', e);
      // Fallback to the default counter formatter when an exception happens
      return defaultCounterFormatter(length, inputEl.maxlength!);
    }
  }
};

const defaultCounterFormatter = (length: number, maxlength: number) => {
  return `${length} / ${maxlength}`;
};

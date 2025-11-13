type FormElement =
  | HTMLIonInputElement
  | HTMLIonTextareaElement
  | HTMLIonSelectElement
  | HTMLIonCheckboxElement
  | HTMLIonToggleElement
  | HTMLElement;

/**
 * Checks if the form element is in an invalid state based on
 * Ionic validation classes.
 *
 * @param el The form element to check.
 * @returns `true` if the element is invalid, `false` otherwise.
 */
export const checkInvalidState = (el: FormElement): boolean => {
  const hasIonTouched = el.classList.contains('ion-touched');
  const hasIonInvalid = el.classList.contains('ion-invalid');

  return hasIonTouched && hasIonInvalid;
};

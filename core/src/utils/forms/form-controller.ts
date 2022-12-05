type HTMLLegacyFormControlElement = HTMLElement & { label?: string };

/**
 * Creates a controller that tracks whether a form control is using the legacy or modern syntax. This should be removed when the legacy form control syntax is removed.
 *
 * @internal
 * @prop el: The Ionic form component to reference
 */
export const createLegacyFormController = (el: HTMLLegacyFormControlElement): LegacyFormController => {
  const controlEl: HTMLLegacyFormControlElement = el;
  let legacyControl = true;

  /**
   * Detect if developers are using the legacy form control syntax
   * so a deprecation warning is logged. This warning can be disabled
   * by either using the new `label` property or setting `aria-label`
   * on the control.
   * Alternatively, components that use a slot for the label
   * can check to see if the component has slotted text
   * in the light DOM.
   */
  const hasLabelProp =
    (controlEl as any).label !== undefined || (controlEl.shadowRoot !== null && controlEl.textContent !== '');
  const hasAriaLabelAttribute = controlEl.hasAttribute('aria-label');

  legacyControl = !hasLabelProp && !hasAriaLabelAttribute;

  const hasLegacyControl = () => {
    return legacyControl;
  };

  return { hasLegacyControl };
};

export type LegacyFormController = {
  hasLegacyControl: () => boolean;
};

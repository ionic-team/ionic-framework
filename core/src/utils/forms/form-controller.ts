/**
 * Creates a controller that tracks whether a form control is using the legacy or modern syntax. This should be removed when the legacy form control syntax is removed.
 *
 * @internal
 * @prop el: The Ionic form component to reference
 */
type AllowedFormElements = HTMLIonInputElement | HTMLIonToggleElement | HTMLIonSelectElement;
export const createLegacyFormController = (el: AllowedFormElements): LegacyFormController => {
  const controlEl: AllowedFormElements = el;
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

  /**
   * Developers can manually opt-out of the modern form markup
   * by setting `legacy="true"` on components.
   */
  legacyControl = controlEl.legacy === true || (!hasLabelProp && !hasAriaLabelAttribute);

  const hasLegacyControl = () => {
    return legacyControl;
  };

  return { hasLegacyControl };
};

export type LegacyFormController = {
  hasLegacyControl: () => boolean;
};

/**
 * Creates a controller that tracks whether a form control is using the legacy or modern syntax.
 *
 * @internal
 */
export const createLegacyFormController = (el: HTMLElement): LegacyFormController => {
  const controlEl: HTMLElement = el;
  let legacyControl = true;

  /**
   * Detect if developers are using the legacy form control syntax
   * so a deprecation warning is logged. This warning can be disabled
   * by either using the new `label` property or setting `aria-label`
   * on the control.
   */
  const hasLabelProp = (controlEl as any).label !== undefined;
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

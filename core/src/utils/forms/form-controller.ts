import { findItemLabel } from '@utils/helpers';

type HTMLLegacyFormControlElement = HTMLElement & { label?: string; legacy?: boolean };

/**
 * Creates a controller that tracks whether a form control is using the legacy or modern syntax. This should be removed when the legacy form control syntax is removed.
 *
 * @internal
 * @prop el: The Ionic form component to reference
 */
export const createLegacyFormController = (el: HTMLLegacyFormControlElement): LegacyFormController => {
  const controlEl: HTMLLegacyFormControlElement = el;
  let legacyControl: boolean | undefined;

  const hasLegacyControl = () => {
    if (legacyControl === undefined) {
      /**
       * Detect if developers are using the legacy form control syntax
       * so a deprecation warning is logged. This warning can be disabled
       * by either using the new `label` property or setting `aria-label`
       * on the control.
       * Alternatively, components that use a slot for the label
       * can check to see if the component has slotted text
       * in the light DOM.
       */
      const hasLabelProp = controlEl.label !== undefined || hasLabelSlot(controlEl);
      const hasAriaLabelAttribute =
        controlEl.hasAttribute('aria-label') ||
        // Shadow DOM form controls cannot use aria-labelledby
        (controlEl.hasAttribute('aria-labelledby') && controlEl.shadowRoot === null);
      const legacyItemLabel = findItemLabel(controlEl);

      /**
       * Developers can manually opt-out of the modern form markup
       * by setting `legacy="true"` on components.
       */
      legacyControl =
        controlEl.legacy === true || (!hasLabelProp && !hasAriaLabelAttribute && legacyItemLabel !== null);
    }
    return legacyControl;
  };

  return { hasLegacyControl };
};

export type LegacyFormController = {
  hasLegacyControl: () => boolean;
};

const hasLabelSlot = (controlEl: HTMLElement) => {
  /**
   * Components that have a named label slot
   * also have other slots, so we need to query for
   * anything that is explicitly passed to slot="label"
   */
  if (NAMED_LABEL_SLOT_COMPONENTS.includes(controlEl.tagName) && controlEl.querySelector('[slot="label"]') !== null) {
    return true;
  }

  /**
   * Components that have an unnamed slot for the label
   * have no other slots, so we can check the textContent
   * of the element.
   */
  if (UNNAMED_LABEL_SLOT_COMPONENTS.includes(controlEl.tagName) && controlEl.textContent !== '') {
    return true;
  }

  return false;
};

const NAMED_LABEL_SLOT_COMPONENTS = ['ION-INPUT', 'ION-TEXTAREA', 'ION-SELECT', 'ION-RANGE'];
const UNNAMED_LABEL_SLOT_COMPONENTS = ['ION-TOGGLE', 'ION-CHECKBOX', 'ION-RADIO'];

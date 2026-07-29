import { Build } from '@stencil/core';

/**
 * An item toggles `item-multiple-inputs` after its form controls render and as
 * inputs are added or removed. Controls that change their focus indicator based
 * on that class need to re-render when it flips.
 *
 * @internal
 * @param el The form control whose closest `ion-item` should be observed.
 * @param onChange Called whenever `item-multiple-inputs` is added or removed.
 * @returns The observer, for the caller to disconnect in `disconnectedCallback`,
 * or `undefined` when there is no parent item, this is not a browser build, or
 * `MutationObserver` is unavailable.
 */
export const createItemMultipleInputsObserver = (
  el: HTMLElement,
  onChange: () => void
): MutationObserver | undefined => {
  const item = el.closest('ion-item');

  if (!item || !Build.isBrowser || typeof MutationObserver === 'undefined') {
    return undefined;
  }

  let wasMultipleInputs = item.classList.contains('item-multiple-inputs');

  const observer = new MutationObserver(() => {
    const isMultipleInputs = item.classList.contains('item-multiple-inputs');

    if (isMultipleInputs !== wasMultipleInputs) {
      wasMultipleInputs = isMultipleInputs;
      onChange();
    }
  });

  observer.observe(item, { attributes: true, attributeFilter: ['class'] });

  return observer;
};

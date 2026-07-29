import { Build } from '@stencil/core';

/**
 * `item-multiple-inputs` is toggled on the item after its form controls render,
 * so a control whose focus styling depends on it needs to re-render when it flips.
 *
 * @internal
 * @param el The form control whose closest `ion-item` should be observed.
 * @param onChange Called whenever `item-multiple-inputs` is added or removed.
 * @returns The observer to disconnect in `disconnectedCallback`, or `undefined`
 * if it could not be created.
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

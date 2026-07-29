import { Build } from '@stencil/core';

/**
 * `item-multiple-inputs` is toggled on the item after its form controls render,
 * so a control whose focus styling depends on it needs to re-render when it flips.
 *
 * @internal
 * @param el The form control whose closest `ion-item` should be observed.
 * @param onChange Called whenever one of `classNames` is added or removed.
 * @param classNames The item classes the caller's rendering depends on. A caller
 * reading more than one must list them all, or changes to the rest are ignored.
 * @returns The observer to disconnect in `disconnectedCallback`, or `undefined`
 * if it could not be created.
 */
export const createItemMultipleInputsObserver = (
  el: HTMLElement,
  onChange: () => void,
  classNames: string[] = ['item-multiple-inputs']
): MutationObserver | undefined => {
  const item = el.closest('ion-item');

  if (!item || !Build.isBrowser || typeof MutationObserver === 'undefined') {
    return undefined;
  }

  const readClasses = () => classNames.map((name) => item.classList.contains(name)).join(',');

  let previousClasses = readClasses();

  const observer = new MutationObserver(() => {
    const currentClasses = readClasses();

    if (currentClasses !== previousClasses) {
      previousClasses = currentClasses;
      onChange();
    }
  });

  observer.observe(item, { attributes: true, attributeFilter: ['class'] });

  return observer;
};

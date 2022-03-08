/**
 * Prints an error informing developers that an implementation requires an element to be used
 * within a specific select.ro
 *
 * @param el The web component element this is requiring the element.
 * @param targetSelectors The selector or selectors that were not found.
 */
const printRequiredElementError = (el: HTMLElement, ...targetSelectors: string[]) => {
  return console.error(
    `<${el.tagName.toLowerCase()}> must be used inside ${targetSelectors.join(' or ')}.`
  );
}

export { printRequiredElementError };

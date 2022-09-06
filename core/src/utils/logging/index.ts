/**
 * Logs a warning to the console with an Ionic prefix
 * to indicate the library that is warning the developer.
 *
 * @param message - The string message to be logged to the console.
 */
export const printIonWarning = (message: string, ...params: any[]) => {
  return console.warn(`[Ionic Warning]: ${message}`, ...params);
};

/*
 * Logs an error to the console with an Ionic prefix
 * to indicate the library that is warning the developer.
 *
 * @param message - The string message to be logged to the console.
 * @param params - Additional arguments to supply to the console.error.
 */
export const printIonError = (message: string, ...params: any) => {
  return console.error(`[Ionic Error]: ${message}`, ...params);
};

/**
 * Prints an error informing developers that an implementation requires an element to be used
 * within a specific selector.
 *
 * @param el The web component element this is requiring the element.
 * @param targetSelectors The selector or selectors that were not found.
 */
export const printRequiredElementError = (el: HTMLElement, ...targetSelectors: string[]) => {
  return console.error(`<${el.tagName.toLowerCase()}> must be used inside ${targetSelectors.join(' or ')}.`);
};

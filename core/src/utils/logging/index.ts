/**
 * Logs a warning to the console with an Ionic prefix
 * to indicate the library that is warning the developer.
 *
 * @param message - The string message to be logged to the console.
 */
export const printIonWarning = (message: string) => {
  return console.warn(`[Ionic Warning]: ${message}`);
}

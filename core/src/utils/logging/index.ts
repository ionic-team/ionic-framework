/**
 * Logs an error to the console with an Ionic prefix
 * to indicate the library that is warning the developer.
 *
 * @param message - The string message to be logged to the console.
 * @param params - Additional arguments to supply to the console.error.
 */
export const printIonError = (message: string, ...params: any) => {
  return console.error(`[Ionic Error]: ${message}`, ...params);
}

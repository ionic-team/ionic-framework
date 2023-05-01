/**
 * "beforeinput" is the appropriate event for preprocessing of the input masking (rather than `keydown`):
 * - `keydown` is not triggered by predictive text from native mobile keyboards.
 * - `keydown` is triggered by system key combinations (we don't need them, and they should be manually filtered).
 * - Dropping text inside input triggers `beforeinput` (but not `keydown`).
 * ___
 * "beforeinput" is not supported by Chrome 49+ (only from 60+) and by Firefox 52+ (only from 87+).
 *
 * @see https://caniuse.com/?search=beforeinput
 * @see https://ionicframework.com/docs/reference/browser-support
 */
export function isBeforeInputEventSupported(
  element: HTMLInputElement | HTMLTextAreaElement,
): boolean {
  return 'onbeforeinput' in element;
}

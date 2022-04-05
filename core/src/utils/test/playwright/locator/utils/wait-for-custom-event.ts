import type { Locator } from '@playwright/test';

import type { E2ELocator } from '../../playwright-declarations';

/**
 * Waits for a custom event to be dispatched on an element handle. Fails after 5000ms without an event emission.
 */
export const waitForCustomEvent = (
  originalFn: (...args: any[]) => Locator,
  selector: string,
  options?: { has?: Locator | undefined; hasText?: string | RegExp | undefined } | undefined
): E2ELocator => {
  const modifiedLocator = originalFn(selector, options) as E2ELocator;
  modifiedLocator.waitForCustomEvent = async (eventName: string, timeoutMs = 5000) => {
    await modifiedLocator.evaluate((el) => {
      // BROWSER CONTEXT
      return new Promise((resolve, reject) => {
        const tmr = setTimeout(() => reject(), timeoutMs);
        el.addEventListener(eventName, (ev) => {
          clearTimeout(tmr);
          resolve(ev);
        });
      });
    });
  };
  return modifiedLocator;
};

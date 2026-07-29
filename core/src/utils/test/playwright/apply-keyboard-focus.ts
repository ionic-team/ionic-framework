import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

import type { E2EPage } from './playwright-declarations';

/**
 * Puts an element into the keyboard focus state that draws the focus indicator.
 * Requires an `ion-app` so `startFocusVisible` is running. Its listeners attach
 * asynchronously, so focus is retried until `ion-focused` sticks.
 *
 * `Shift` re-enables keyboard mode without moving focus, in case a pointer event
 * earlier in the test turned it off. Focus moves programmatically because Firefox
 * cannot move it back into the page once blurred, so an early Tab is unretryable.
 */
export const applyKeyboardFocus = async (page: E2EPage, locator: Locator) => {
  await expect(async () => {
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.keyboard.press('Shift');
    await locator.focus();
    await expect(locator).toHaveClass(/ion-focused/, { timeout: 250 });
  }).toPass({ timeout: 5000 });
};

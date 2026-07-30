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
 *
 * Pass `indicatorLocator` when something other than the focused element gets
 * `ion-focused`. A checkbox or radio alone in an item has no `ion-focusable` class of
 * its own because the item draws the indicator for it, so wait on the item.
 */
export const applyKeyboardFocus = async (page: E2EPage, locator: Locator, indicatorLocator: Locator = locator) => {
  await expect(async () => {
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.keyboard.press('Shift');
    await locator.focus();
    await expect(indicatorLocator).toHaveClass(/ion-focused/, { timeout: 250 });
  }).toPass({ timeout: 5000 });
};

import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * The focus trap redirects focus back into the overlay when focus lands outside
 * of it. The indicator should only follow that redirect during keyboard
 * navigation.
 *
 * It lands on the `ion-item` because a toggle inside an item has the item draw
 * the indicator on its behalf.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('popover: focus trap'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/popover/test/focus-trap', config);

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

      // Opening with a click leaves the focus utility in pointer mode.
      await page.locator('#open-popover').click();
      await ionPopoverDidPresent.next();
    });

    test('should not show a focus indicator when focus is redirected after a pointer interaction', async ({ page }) => {
      const item = page.locator('ion-popover ion-item');

      await page.locator('.ion-page div[tabindex="0"]').evaluate((el: HTMLElement) => el.focus());
      await page.waitForChanges();

      await expect(item).not.toHaveClass(/ion-focused/);
    });

    test('should show a focus indicator when focus is redirected during keyboard navigation', async ({ page }) => {
      const item = page.locator('ion-popover ion-item');

      // Shift turns keyboard mode back on without moving focus.
      await page.keyboard.press('Shift');
      await page.locator('.ion-page div[tabindex="0"]').evaluate((el: HTMLElement) => el.focus());
      await page.waitForChanges();

      await expect(item).toHaveClass(/ion-focused/);
    });
  });
});

import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes/directions
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('popover: alignment with async component'), async () => {
    test('should align popover centered with button when component is added async', async ({ page }) => {
      await page.goto('/src/components/popover/test/async', config);

      const ionPopoverDidPresent = await page.spyOnEvent('ionPopoverDidPresent');

      const button = page.locator('#button');
      await button.click();

      await ionPopoverDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`popover-async`));
    });
  });
});

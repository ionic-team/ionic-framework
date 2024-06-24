import { expect } from '@playwright/test';
import { configs, test, dragElementBy } from '@utils/test/playwright';

/**
 * This behavior does not vary across modes
 */
configs({ modes: ['ionic-md', 'md', 'ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('item-sliding: states'), () => {
    test.describe('state: disabled', () => {
      test('should not have visual regressions for an option', async ({ page }) => {
        await page.goto(`/src/components/item-sliding/test/states`, config);

        const item = page.locator('#disabled-options');

        /**
         * Negative dragByX value to drag element from the right to the left
         * to reveal the options on the right side.
         */
        const dragByX = -150;

        await dragElementBy(item, page, dragByX);
        await page.waitForChanges();

        await expect(item).toHaveScreenshot(screenshot(`item-sliding-option-disabled`));
      });
    });
  });
});

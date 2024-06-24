import { expect } from '@playwright/test';
import { configs, test, dragElementBy } from '@utils/test/playwright';

/**
 * The shapes on the `item-option` do not vary by direction
 * when they are not being dragged.
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('item-sliding: shapes'), () => {
    test('should not have visual regressions when not expanded', async ({ page }) => {
      await page.goto(`/src/components/item-sliding/test/shapes`, config);

      const itemIDs = ['round', 'soft', 'rectangular'];
      for (const itemID of itemIDs) {
        const item = page.locator(`#${itemID}`);

        /**
         * Negative dragByX value to drag element from the right to the left
         * to reveal the options on the right side.
         */
        const dragByX = -150;

        await dragElementBy(item, page, dragByX);
        await page.waitForChanges();

        await expect(item).toHaveScreenshot(screenshot(`item-sliding-${itemID}`));
      }
    });
  });
});

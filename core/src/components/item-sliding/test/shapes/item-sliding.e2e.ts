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

/**
 * item-sliding doesn't have mode-specific styling,
 * but the child components, item-options and item-option, do.
 *
 * It is important to test all modes to ensure that the
 * child components are being rendered correctly.
 */
configs({ modes: ['ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('item-sliding: shapes'), () => {
    test('should not have visual regressions when expanded', async ({ page }) => {
      await page.goto(`/src/components/item-sliding/test/shapes`, config);

      const itemIDs = ['round', 'soft', 'rectangular'];
      for (const itemID of itemIDs) {
        /**
         * Clicking on the page to release the mouse.
         *
         * This is necessary because the mouse is held down
         * later in the test to take a screenshot of the
         * expanded item. If the mouse is not released, the
         * next item will not be able to be dragged.
         */
        await page.mouse.click(0, 0);

        const item = page.locator(`#${itemID}`);

        /**
         * Negative dragByX value to drag element from the right to the left
         * to reveal the options on the right side.
         * Positive dragByX value to drag element from the left to the right
         * to reveal the options on the left side.
         */
        const dragByX = config.direction === 'rtl' ? 150 : -150;

        await dragElementBy(item, page, dragByX);
        await page.waitForChanges();

        const lastOption = item.locator('ion-item-option:last-of-type');

        await dragElementBy(lastOption, page, dragByX, 0, undefined, undefined, false);
        await page.waitForChanges();

        await expect(item).toHaveScreenshot(screenshot(`item-sliding-expandable-${itemID}`));
      }
    });
  });
});

import { expect } from '@playwright/test';
import { configs, test, dragElementBy } from '@utils/test/playwright';

/**
 * Drag distances that reveal options without crossing the full swipe threshold
 * (optsWidth + SWIPE_MARGIN). A narrower options panel requires a shorter drag.
 */
const DRAG_DISTANCE_TWO_OPTIONS = 150;

/**
 * The shapes on the `item-option` do not vary by direction
 * when they are not being dragged.
 */
configs({ modes: ['ionic-md'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('item-sliding: shapes'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/item-sliding/test/shapes`, config);
    });

    ['round', 'soft', 'rectangular'].forEach((shape) => {
      test(`${shape} - should not have visual regressions when not expanded`, async ({ page }) => {
        const item = page.locator(`#${shape}`);

        /**
         * Negative dragByX value to drag element from the right to the left
         * to reveal the options on the right side.
         */
        const dragByX = -DRAG_DISTANCE_TWO_OPTIONS;

        await dragElementBy(item, page, dragByX, 0, undefined, undefined, undefined, 15);
        await page.waitForChanges();

        await expect(item).toHaveScreenshot(screenshot(`item-sliding-${shape}`));
      });
    });
  });
});

import { expect } from '@playwright/test';
import { configs, test, dragElementBy } from '@utils/test/playwright';

import { DRAG_DISTANCE_MULTIPLE_OPTIONS } from '../test.utils';

/**
 * item-sliding doesn't have mode-specific styling,
 * but the child components, item-options and item-option, do.
 *
 * It is important to test all modes to ensure that the
 * child components are being rendered correctly.
 */
configs({ modes: ['ionic-md', 'ios', 'md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('item-sliding: icons'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/item-sliding/test/icons`, config);
    });

    ['iconsOnly', 'iconsStart', 'iconsEnd', 'iconsTop', 'iconsBottom'].forEach((position) => {
      test(`${position} - should not have visual regressions`, async ({ page }) => {
        const item = page.locator(`#${position}`);

        /**
         * Negative dragByX value to drag element from the right to the left
         * to reveal the options on the right side.
         * Positive dragByX value to drag element from the left to the right
         * to reveal the options on the left side.
         */
        const dragByX = config.direction === 'rtl' ? DRAG_DISTANCE_MULTIPLE_OPTIONS : -DRAG_DISTANCE_MULTIPLE_OPTIONS;

        await dragElementBy(item, page, dragByX, 0, undefined, undefined, true, 15);
        await page.waitForChanges();

        // Convert camelCase ids to kebab-case for screenshot file names
        const positionKebab = position.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        await expect(item).toHaveScreenshot(screenshot(`item-sliding-${positionKebab}`));
      });
    });
  });
});

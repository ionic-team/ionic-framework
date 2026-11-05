import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { ION_CHIP_SHAPES } from '../../chip.interface';

/**
 * This behavior does not vary across directions
 */
configs({ modes: ['ionic-md', 'md', 'ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('chip: shape'), () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/chip/test/shape`, config);
    });

    ION_CHIP_SHAPES.forEach((shape) => {
      test(`should not have visual regressions with ${shape} shape`, async ({ page }) => {
        const container = page.locator(`#${shape}`);

        await expect(container).toHaveScreenshot(screenshot(`chip-${shape}`));
      });
    });
  });
});

import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/modal/test/shape', config);
  });

  test.describe(title('modal: shape'), () => {
    test.describe('sheet', () => {
      ['default', 'round', 'soft', 'rectangular'].forEach((shape) => {
        test(`${shape} - should not have visual regressions`, async ({ page }) => {
          const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

          await page.click(`#sheet-modal-${shape}`);
          await ionModalDidPresent.next();

          await expect(page).toHaveScreenshot(screenshot(`modal-shape-sheet-${shape}`), {
            /**
             * Animations must be enabled to capture the screenshot.
             * By default, animations are disabled with toHaveScreenshot,
             * and when capturing the screenshot will call animation.finish().
             * This will cause the modal to close and the screenshot capture
             * to be invalid.
             */
            animations: 'allow',
          });
        });
      });
    });

    test.describe('card', () => {
      ['default', 'round', 'soft', 'rectangular'].forEach((shape) => {
        test(`${shape} - should not have visual regressions`, async ({ page }) => {
          const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

          await page.click(`#card-modal-${shape}`);
          await ionModalDidPresent.next();

          await expect(page).toHaveScreenshot(screenshot(`modal-shape-card-${shape}`), {
            /**
             * Animations must be enabled to capture the screenshot.
             * By default, animations are disabled with toHaveScreenshot,
             * and when capturing the screenshot will call animation.finish().
             * This will cause the popover to close and the screenshot capture
             * to be invalid.
             */
            animations: 'allow',
          });
        });
      });
    });
  });
});

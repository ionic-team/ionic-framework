import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * All content takes up the full width, so RTL has no effect.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: round'), () => {
    test.describe('default', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.goto(`/src/components/button/test/round`, config);

        await page.setIonViewport();

        const container = page.locator('#default');

        await expect(container).toHaveScreenshot(screenshot(`button-round`));
      });
    });

    test.describe('outline', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.goto(`/src/components/button/test/round`, config);

        await page.setIonViewport();

        const container = page.locator('#outline');

        await expect(container).toHaveScreenshot(screenshot(`button-outline-round`));
      });
    });

    test.describe('clear', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.goto(`/src/components/button/test/round`, config);

        await page.setIonViewport();

        const container = page.locator('#clear');

        await expect(container).toHaveScreenshot(screenshot(`button-clear-round`));
      });
    });

    test.describe('color', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.goto(`/src/components/button/test/round`, config);

        await page.setIonViewport();

        const container = page.locator('#color');

        await expect(container).toHaveScreenshot(screenshot(`button-color-round`));
      });
    });

    test.describe('expand', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.goto(`/src/components/button/test/round`, config);

        await page.setIonViewport();

        const container = page.locator('#expand');

        await expect(container).toHaveScreenshot(screenshot(`button-expand-round`));
      });
    });
  });
});

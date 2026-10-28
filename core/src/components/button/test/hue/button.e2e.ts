import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ios', 'md', 'ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: hue'), () => {
    test('should render each hue in each fill and state', async ({ page }) => {
      await page.goto(`/src/components/button/test/hue`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`button-hue`));
    });
  });
});

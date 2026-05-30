import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'], palettes: ['light', 'dark'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('datetime: color'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <div id="container" style="width: 250px;">
          <ion-datetime
            color="danger"
            value="2022-05-03"
            show-default-title="true"
            show-default-buttons="true"
          ></ion-datetime>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await page.locator('.datetime-ready').waitFor();

      await expect(container).toHaveScreenshot(screenshot(`datetime-color`));
    });
  });
});

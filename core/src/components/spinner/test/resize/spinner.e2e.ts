import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * The resize behavior does not vary across directions or modes.
 */
configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('spinner: resize'), () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 340 });
    });
    test('should not have visual regressions', async ({ page }, testInfo) => {
      testInfo.annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/18115',
      });

      await page.setContent(
        `
          <style>
            ion-spinner.spinner-size-medium {
              --ion-spinner-size-medium-width: 100px;
              --ion-spinner-size-medium-height: 100px;
            }
          </style>

          <ion-spinner size="medium" name="lines"></ion-spinner>
          <ion-spinner size="medium" name="lines-small"></ion-spinner>
          <ion-spinner size="medium" name="lines-sharp"></ion-spinner>
          <ion-spinner size="medium" name="lines-sharp-small"></ion-spinner>
          <ion-spinner size="medium" name="circular"></ion-spinner>
          <ion-spinner size="medium" name="dots"></ion-spinner>
          <ion-spinner size="medium" name="bubbles"></ion-spinner>
          <ion-spinner size="medium" name="circles"></ion-spinner>
          <ion-spinner size="medium" name="crescent"></ion-spinner>
        `,
        config
      );

      await expect(page).toHaveScreenshot(screenshot('spinner-resize'));
    });
  });
});

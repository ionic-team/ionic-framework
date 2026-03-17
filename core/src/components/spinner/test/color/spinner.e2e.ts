import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions or modes.
 */
configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('spinner: color'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
          <div class="container">
            <ion-spinner name="lines" paused color="primary"></ion-spinner>
            <ion-spinner name="lines" paused color="secondary"></ion-spinner>
            <ion-spinner name="lines" paused color="tertiary"></ion-spinner>
            <ion-spinner name="lines" paused color="success"></ion-spinner>
            <ion-spinner name="lines" paused color="warning"></ion-spinner>
            <ion-spinner name="lines" paused color="danger"></ion-spinner>
            <ion-spinner name="lines" paused color="light"></ion-spinner>
            <ion-spinner name="lines" paused color="medium"></ion-spinner>
            <ion-spinner name="lines" paused color="dark"></ion-spinner>
          </div>
        `,
        config
      );

      const container = page.locator('.container');

      await expect(container).toHaveScreenshot(screenshot('spinner-color'));
    });
  });
});

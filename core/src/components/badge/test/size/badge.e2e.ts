import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('badge: size'), () => {
    test('should render small badges', async ({ page }) => {
      await page.setContent(
        `
        <ion-badge size="small">00</ion-badge>
      `,
        config
      );

      const badge = page.locator('ion-badge');

      await expect(badge).toHaveScreenshot(screenshot(`badge-size-small`));
    });
  });
});

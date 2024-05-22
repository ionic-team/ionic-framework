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

    test('should render medium badges', async ({ page }) => {
      await page.setContent(
        `
        <ion-badge size="medium">00</ion-badge>
      `,
        config
      );

      const badge = page.locator('ion-badge');

      await expect(badge).toHaveScreenshot(screenshot(`badge-size-medium`));
    });

    test('should render large badges', async ({ page }) => {
      await page.setContent(
        `
        <ion-badge size="large">00</ion-badge>
      `,
        config
      );

      const badge = page.locator('ion-badge');

      await expect(badge).toHaveScreenshot(screenshot(`badge-size-large`));
    });

    test('should render xlarge badges', async ({ page }) => {
      await page.setContent(
        `
        <ion-badge size="xlarge">00</ion-badge>
      `,
        config
      );

      const badge = page.locator('ion-badge');

      await expect(badge).toHaveScreenshot(screenshot(`badge-size-xlarge`));
    });
  });
});

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
        <ion-badge size="small">1</ion-badge>
      `,
        config
      );

      const badge = page.locator('ion-badge');

      await expect(badge).toHaveScreenshot(screenshot(`badge-size-small`));
    });

    test('should render small badges with long text', async ({ page }) => {
      await page.setContent(
        `
        <ion-badge size="small">99+</ion-badge>
      `,
        config
      );

      const badge = page.locator('ion-badge');

      await expect(badge).toHaveScreenshot(screenshot(`badge-size-small-long-text`));
    });

    test('should render small badges with icon', async ({ page }) => {
      await page.setContent(
        `
        <ion-badge size="small">
          <ion-icon name="logo-ionic"></ion-icon>
        </ion-badge>
      `,
        config
      );

      const badge = page.locator('ion-badge');

      await expect(badge).toHaveScreenshot(screenshot(`badge-size-small-icon`));
    });

    test('should render medium badges', async ({ page }) => {
      await page.setContent(
        `
        <ion-badge size="medium">1</ion-badge>
      `,
        config
      );

      const badge = page.locator('ion-badge');

      await expect(badge).toHaveScreenshot(screenshot(`badge-size-medium`));
    });

    test('should render medium badges with long text', async ({ page }) => {
      await page.setContent(
        `
        <ion-badge size="medium">99+</ion-badge>
      `,
        config
      );

      const badge = page.locator('ion-badge');

      await expect(badge).toHaveScreenshot(screenshot(`badge-size-medium-long-text`));
    });

    test('should render medium badges with icon', async ({ page }) => {
      await page.setContent(
        `
        <ion-badge size="medium">
          <ion-icon name="logo-ionic"></ion-icon>
        </ion-badge>
      `,
        config
      );

      const badge = page.locator('ion-badge');

      await expect(badge).toHaveScreenshot(screenshot(`badge-size-medium-icon`));
    });
  });
});

import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('badge: shape'), () => {
    test('should render soft badges', async ({ page }) => {
      await page.setContent(
        `
        <ion-badge shape="soft">1</ion-badge>
      `,
        config
      );

      const badge = page.locator('ion-badge');

      await expect(badge).toHaveScreenshot(screenshot(`badge-shape-soft`));
    });

    test('should render soft badges with long text', async ({ page }) => {
      await page.setContent(
        `
        <ion-badge shape="soft">99+</ion-badge>
      `,
        config
      );

      const badge = page.locator('ion-badge');

      await expect(badge).toHaveScreenshot(screenshot(`badge-shape-soft-long-text`));
    });

    test('should render round badges', async ({ page }) => {
      await page.setContent(
        `
        <ion-badge shape="round">1</ion-badge>
      `,
        config
      );

      const badge = page.locator('ion-badge');

      await expect(badge).toHaveScreenshot(screenshot(`badge-shape-round`));
    });

    test('should render round badges with long text', async ({ page }) => {
      await page.setContent(
        `
        <ion-badge shape="round">99+</ion-badge>
      `,
        config
      );

      const badge = page.locator('ion-badge');

      await expect(badge).toHaveScreenshot(screenshot(`badge-shape-round-long-text`));
    });
  });
});

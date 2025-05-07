import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('badge: shape'), () => {
    test('should render soft badges for small size', async ({ page }) => {
      await page.setContent(
        `
        <div id="container">
          <ion-badge shape="soft" size="small">1</ion-badge>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`badge-shape-soft-small-size`));
    });

    test('should render soft badges with long text for small size', async ({ page }) => {
      await page.setContent(
        `
        <div id="container">
          <ion-badge shape="soft" size="small">99+</ion-badge>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`badge-shape-soft-small-size-long-text`));
    });

    test('should render soft badges with icon for small size', async ({ page }) => {
      await page.setContent(
        `
        <div id="container">
          <ion-badge shape="soft" size="small">
            <ion-icon name="logo-ionic"></ion-icon>
          </ion-badge>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`badge-shape-soft-small-size-icon`));
    });

    test('should render soft badges for larger sizes', async ({ page }) => {
      await page.setContent(
        `
        <div id="container">
          <ion-badge shape="soft" size="medium">1</ion-badge>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`badge-shape-soft-larger-sizes`));
    });

    test('should render soft badges with long text for larger sizes', async ({ page }) => {
      await page.setContent(
        `
        <div id="container">
          <ion-badge shape="soft" size="medium">99+</ion-badge>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`badge-shape-soft-larger-sizes-long-text`));
    });

    test('should render soft badges with icon for larger sizes', async ({ page }) => {
      await page.setContent(
        `
        <div id="container">
          <ion-badge shape="soft" size="medium">
            <ion-icon name="logo-ionic"></ion-icon>
          </ion-badge>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`badge-shape-soft-larger-sizes-icon`));
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

    test('should render round badges with icon', async ({ page }) => {
      await page.setContent(
        `
        <ion-badge shape="round">
          <ion-icon name="logo-ionic"></ion-icon>
        </ion-badge>
      `,
        config
      );

      const badge = page.locator('ion-badge');

      await expect(badge).toHaveScreenshot(screenshot(`badge-shape-round-icon`));
    });

    test('should render rectangular badges', async ({ page }) => {
      await page.setContent(
        `
        <ion-badge shape="rectangular">1</ion-badge>
      `,
        config
      );

      const badge = page.locator('ion-badge');

      await expect(badge).toHaveScreenshot(screenshot(`badge-shape-rectangular`));
    });

    test('should render rectangular badges with long text', async ({ page }) => {
      await page.setContent(
        `
        <ion-badge shape="rectangular">99+</ion-badge>
      `,
        config
      );

      const badge = page.locator('ion-badge');

      await expect(badge).toHaveScreenshot(screenshot(`badge-shape-rectangular-long-text`));
    });

    test('should render rectangular badges with icon', async ({ page }) => {
      await page.setContent(
        `
        <ion-badge shape="rectangular">
          <ion-icon name="logo-ionic"></ion-icon>
        </ion-badge>
      `,
        config
      );

      const badge = page.locator('ion-badge');

      await expect(badge).toHaveScreenshot(screenshot(`badge-shape-rectangular-icon`));
    });
  });
});

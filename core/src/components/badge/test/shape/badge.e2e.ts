import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('badge: shape'), () => {
    test('should render soft badges for smaller sizes', async ({ page }) => {
      await page.setContent(
        `
        <div id="container">
          <ion-badge shape="soft" size="xxsmall">1</ion-badge>
          <ion-badge shape="soft" size="xsmall">1</ion-badge>
          <ion-badge shape="soft" size="small">1</ion-badge>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`badge-shape-soft-smaller-sizes`));
    });

    test('should render soft badges with long text for smaller sizes', async ({ page }) => {
      await page.setContent(
        `
        <div id="container">
          <ion-badge shape="soft" size="xxsmall">99+</ion-badge>
          <ion-badge shape="soft" size="xsmall">99+</ion-badge>
          <ion-badge shape="soft" size="small">99+</ion-badge>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`badge-shape-soft-smaller-sizes-long-text`));
    });

    test('should render soft badges for larger sizes', async ({ page }) => {
      await page.setContent(
        `
        <div id="container">
          <ion-badge shape="soft" size="medium">1</ion-badge>
          <ion-badge shape="soft" size="large">1</ion-badge>
          <ion-badge shape="soft" size="xlarge">1</ion-badge>
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
          <ion-badge shape="soft" size="large">99+</ion-badge>
          <ion-badge shape="soft" size="xlarge">99+</ion-badge>
        </div>
      `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`badge-shape-soft-larger-sizes-long-text`));
    });
  });
});

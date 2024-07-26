import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('spinner: size'), () => {
    test('should render xsmall spinner', async ({ page }) => {
      await page.setContent(
        `
        <ion-spinner size="xsmall"></ion-spinner>
      `,
        config
      );

      const spinner = page.locator('ion-spinner');

      await expect(spinner).toHaveScreenshot(screenshot(`spinner-size-xsmall`));
    });

    test('should render small spinner', async ({ page }) => {
      await page.setContent(
        `
        <ion-spinner size="small"></ion-spinner>
      `,
        config
      );

      const spinner = page.locator('ion-spinner');

      await expect(spinner).toHaveScreenshot(screenshot(`spinner-size-small`));
    });

    test('should render medium spinner', async ({ page }) => {
      await page.setContent(
        `
        <ion-spinner size="medium"></ion-spinner>
      `,
        config
      );

      const spinner = page.locator('ion-spinner');

      await expect(spinner).toHaveScreenshot(screenshot(`spinner-size-medium`));
    });

    test('should render large spinner', async ({ page }) => {
      await page.setContent(
        `
        <ion-spinner size="large"></ion-spinner>
      `,
        config
      );

      const spinner = page.locator('ion-spinner');

      await expect(spinner).toHaveScreenshot(screenshot(`spinner-size-large`));
    });

    test('should render xlarge spinner', async ({ page }) => {
      await page.setContent(
        `
        <ion-spinner size="xlarge"></ion-spinner>
      `,
        config
      );

      const spinner = page.locator('ion-spinner');

      await expect(spinner).toHaveScreenshot(screenshot(`spinner-size-xlarge`));
    });
  });
});

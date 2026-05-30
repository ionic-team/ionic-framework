import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('breadcrumbs: color'), () => {
    test('should not have visual regressions with primary color', async ({ page }) => {
      await page.setContent(
        `
        <ion-breadcrumbs color="primary">
          <ion-breadcrumb>First</ion-breadcrumb>
          <ion-breadcrumb>Second</ion-breadcrumb>
          <ion-breadcrumb>Third</ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-color-primary`));
    });

    test('should not have visual regressions with disabled primary color', async ({ page }) => {
      await page.setContent(
        `
        <ion-breadcrumbs color="primary">
          <ion-breadcrumb disabled>First</ion-breadcrumb>
          <ion-breadcrumb disabled>Second</ion-breadcrumb>
          <ion-breadcrumb disabled>Third</ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-color-primary-disabled`));
    });

    test('should not have visual regressions with focused primary color', async ({ page }) => {
      await page.setContent(
        `
        <ion-breadcrumbs color="primary">
          <ion-breadcrumb>First</ion-breadcrumb>
          <ion-breadcrumb class="ion-focused">Second</ion-breadcrumb>
          <ion-breadcrumb>Third</ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-color-primary-focused`));
    });

    test('should not have visual regressions with varied breadcrumb color', async ({ page }) => {
      await page.setContent(
        `
        <ion-breadcrumbs>
          <ion-breadcrumb color="secondary">First</ion-breadcrumb>
          <ion-breadcrumb color="danger">Second</ion-breadcrumb>
          <ion-breadcrumb color="tertiary">Third</ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-color-varied`));
    });

    test('should not have visual regressions with secondary breadcrumbs and danger color', async ({ page }) => {
      await page.setContent(
        `
        <ion-breadcrumbs color="secondary">
          <ion-breadcrumb>First</ion-breadcrumb>
          <ion-breadcrumb color="danger">Second</ion-breadcrumb>
          <ion-breadcrumb>Third</ion-breadcrumb>
        </ion-breadcrumbs>
      `,
        config
      );

      const breadcrumbs = page.locator('ion-breadcrumbs');

      await expect(breadcrumbs).toHaveScreenshot(screenshot(`breadcrumbs-color-secondary-breadcrumb-danger`));
    });
  });
});

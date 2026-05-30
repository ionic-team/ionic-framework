import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('title: font scaling'), () => {
    test('should scale default title text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 36px;
          }
        </style>
        <ion-header>
          <ion-toolbar>
            <ion-title>Title</ion-title>
          </ion-toolbar>
        </ion-header>
      `,
        config
      );

      const title = page.locator('ion-title');

      await expect(title).toHaveScreenshot(screenshot(`title-default-scale`));
    });

    test('should scale small title text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 36px;
          }
        </style>
        <ion-header>
          <ion-toolbar>
            <ion-title size="small">Title</ion-title>
          </ion-toolbar>
        </ion-header>
      `,
        config
      );

      const title = page.locator('ion-title');

      await expect(title).toHaveScreenshot(screenshot(`title-small-scale`));
    });
  });
});

configs({ directions: ['ltr'], modes: ['ios'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('title: font scaling for large attribute'), () => {
    test('should scale text on larger font sizes', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 36px;
          }
        </style>
        <ion-header>
          <ion-toolbar>
            <ion-title size="large">Title</ion-title>
          </ion-toolbar>
        </ion-header>
      `,
        config
      );

      const title = page.locator('ion-title');

      await expect(title).toHaveScreenshot(screenshot(`title-large-scale`));
    });
  });
});

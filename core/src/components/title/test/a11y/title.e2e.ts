import AxeBuilder from '@axe-core/playwright';
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

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('title: level 1 heading'), () => {
    test('should not have accessibility violations', async ({ page }) => {
      /**
       * Level 1 headings must be inside of a landmark (ion-header)
       */
      await page.setContent(
        `
        <ion-header>
          <ion-toolbar>
            <ion-title>My Title</ion-title>
          </ion-toolbar>
        </ion-header>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
    test('should not have accessibility violations with multiple h1 elements on a hidden page', async ({ page }) => {
      await page.setContent(
        `
        <div class="ion-page ion-page-hidden">
          <ion-header>
            <ion-toolbar>
              <ion-title>My Title</ion-title>
            </ion-toolbar>
          </ion-header>
        </div>
        <div class="ion-page">
          <ion-header>
            <ion-toolbar>
              <ion-title>My Title</ion-title>
            </ion-toolbar>
          </ion-header>
        </div>
      `,
        config
      );

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  });
});

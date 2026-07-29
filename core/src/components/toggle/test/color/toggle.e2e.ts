import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('toggle: color'), () => {
    test('should apply color when checked', async ({ page }) => {
      await page.setContent(
        `
        <ion-toggle color="danger" checked="true">Label</ion-toggle>
      `,
        config
      );

      const toggle = page.locator('ion-toggle');
      await expect(toggle).toHaveScreenshot(screenshot(`toggle-color-checked`));
    });

    test('should not apply color when unchecked', async ({ page }) => {
      await page.setContent(
        `
        <ion-toggle color="danger">Label</ion-toggle>
      `,
        config
      );

      const toggle = page.locator('ion-toggle');
      await expect(toggle).toHaveScreenshot(screenshot(`toggle-color-unchecked`));
    });

    test('should apply color to the focus indicator when checked', async ({ page, pageUtils }) => {
      // `ion-app` is required so `startFocusVisible` runs and applies the
      // `ion-focused` class on keyboard focus, which drives the focus indicator.
      await page.setContent(
        `
        <style>
          #container {
            width: fit-content;
            padding: 10px;
          }
        </style>

        <ion-app>
          <div id="container">
            <ion-toggle color="danger" checked="true">Label</ion-toggle>
          </div>
        </ion-app>
      `,
        config
      );

      const toggle = page.locator('ion-toggle');

      // The focus listeners attach asynchronously, so the first Tab can miss
      // them. Retry until `ion-focused` sticks before taking the snapshot.
      await expect(async () => {
        await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
        await pageUtils.pressKeys('Tab');
        await expect(toggle).toHaveClass(/ion-focused/, { timeout: 250 });
      }).toPass({ timeout: 5000 });

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`toggle-color-focus-checked`));
    });

    test('should not apply color to the focus indicator when unchecked', async ({ page, pageUtils }) => {
      await page.setContent(
        `
        <style>
          #container {
            width: fit-content;
            padding: 10px;
          }
        </style>

        <ion-app>
          <div id="container">
            <ion-toggle color="danger">Label</ion-toggle>
          </div>
        </ion-app>
      `,
        config
      );

      const toggle = page.locator('ion-toggle');

      // The focus listeners attach asynchronously, so the first Tab can miss
      // them. Retry until `ion-focused` sticks before taking the snapshot.
      await expect(async () => {
        await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
        await pageUtils.pressKeys('Tab');
        await expect(toggle).toHaveClass(/ion-focused/, { timeout: 250 });
      }).toPass({ timeout: 5000 });

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`toggle-color-focus-unchecked`));
    });
  });
});

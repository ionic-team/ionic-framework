import { expect } from '@playwright/test';
import { applyKeyboardFocus, configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ios', 'md', 'ionic-md'] }).forEach(({ title, screenshot, config }) => {
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

    test('should apply color to the focus indicator when checked', async ({ page }) => {
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

      await applyKeyboardFocus(page, toggle);

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`toggle-color-focus-checked`));
    });

    test('should not apply color to the focus indicator when unchecked', async ({ page }) => {
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

      await applyKeyboardFocus(page, toggle);

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`toggle-color-focus-unchecked`));
    });
  });
});

import { expect } from '@playwright/test';
import { applyKeyboardFocus, configs, test } from '@utils/test/playwright';

/**
 * This behavior does not vary across directions
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('radio: focus visual'), () => {
    test('should render focus indicator when unchecked', async ({ page }) => {
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
            <ion-radio-group>
              <ion-radio value="a">Unchecked</ion-radio>
            </ion-radio-group>
          </div>
        </ion-app>
      `,
        config
      );

      const radio = page.locator('ion-radio');

      await applyKeyboardFocus(page, radio);

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`radio-focus`));
    });

    test('should render focus indicator when checked', async ({ page }) => {
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
            <ion-radio-group value="a">
              <ion-radio value="a">Checked</ion-radio>
            </ion-radio-group>
          </div>
        </ion-app>
      `,
        config
      );

      const radio = page.locator('ion-radio');

      await applyKeyboardFocus(page, radio);

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`radio-focus-checked`));
    });
  });
});

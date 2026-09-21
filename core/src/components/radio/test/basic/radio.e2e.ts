import { expect } from '@playwright/test';
import { applyKeyboardFocus, configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('radio'), () => {
    test('should render multiple correctly', async ({ page }) => {
      await page.setContent(
        `
        <style>
          /* The radio checks are cut off without a container margin */
          #container {
            margin-top: 20px;
            margin-bottom: 20px;
          }
        </style>

        <div id="container">
          <ion-radio-group>
            <ion-radio>Enable Notifications</ion-radio><br />
            <ion-radio>Enable Notifications</ion-radio>
          </ion-radio-group>
        </div>
      `,
        config
      );
      const container = page.locator('#container');
      await expect(container).toHaveScreenshot(screenshot(`radio-multiple`));
    });
  });
});

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

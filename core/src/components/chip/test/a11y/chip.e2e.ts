import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  /**
   * Font scaling does not vary across directions.
   */
  test.describe(title('chip: font scaling'), () => {
    test('should scale text', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 30px;
          }
        </style>
        <ion-chip>
          <ion-avatar>
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjYzVkYmZmIiBkPSJNMCAwaDUxMnY1MTJIMHoiLz48cGF0aCBkPSJNMjU2IDMwNGM2MS42IDAgMTEyLTUwLjQgMTEyLTExMlMzMTcuNiA4MCAyNTYgODBzLTExMiA1MC40LTExMiAxMTIgNTAuNCAxMTIgMTEyIDExMnptMCA0MGMtNzQuMiAwLTIyNCAzNy44LTIyNCAxMTJ2NTZoNDQ4di01NmMwLTc0LjItMTQ5LjgtMTEyLTIyNC0xMTJ6IiBmaWxsPSIjODJhZWZmIi8+PC9zdmc+"
            />
          </ion-avatar>
          <ion-label>With Icon and Avatar</ion-label>
          <ion-icon name="close-circle"></ion-icon>
        </ion-chip>`,
        config
      );

      const chip = page.locator('ion-chip');

      await expect(chip).toHaveScreenshot(screenshot('chip-scale'));
    });
  });
});

configs({ directions: ['ltr'], modes: ['md'] }).forEach(({ title, screenshot, config }) => {
  /**
   * Font scaling does not vary across directions
   * ios mode has a min font size
   */
  test.describe(title('chip: contents at large scale'), () => {
    test('should handle contents wider than chip', async ({ page }) => {
      await page.setContent(
        `
        <style>
          html {
            font-size: 48px;
          }
        </style>
        <ion-chip>
          <ion-avatar>
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjYzVkYmZmIiBkPSJNMCAwaDUxMnY1MTJIMHoiLz48cGF0aCBkPSJNMjU2IDMwNGM2MS42IDAgMTEyLTUwLjQgMTEyLTExMlMzMTcuNiA4MCAyNTYgODBzLTExMiA1MC40LTExMiAxMTIgNTAuNCAxMTIgMTEyIDExMnptMCA0MGMtNzQuMiAwLTIyNCAzNy44LTIyNCAxMTJ2NTZoNDQ4di01NmMwLTc0LjItMTQ5LjgtMTEyLTIyNC0xMTJ6IiBmaWxsPSIjODJhZWZmIi8+PC9zdmc+"
            />
          </ion-avatar>
          <ion-label>With Icon and Avatar</ion-label>
          <ion-icon name="close-circle"></ion-icon>
        </ion-chip>`,
        config
      );

      const chip = page.locator('ion-chip');

      await expect(chip).toHaveScreenshot(screenshot('chip-large-contents'));
    });
  });
});

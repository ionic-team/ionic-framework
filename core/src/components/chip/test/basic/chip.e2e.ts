import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'] }).forEach(({ title, screenshot, config }) => {
  /**
   * Chip rendering does not vary across modes.
   */
  test.describe(title('chip: rendering'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.setContent(
        `
        <ion-chip>
          <ion-avatar>
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjYzVkYmZmIiBkPSJNMCAwaDUxMnY1MTJIMHoiLz48cGF0aCBkPSJNMjU2IDMwNGM2MS42IDAgMTEyLTUwLjQgMTEyLTExMlMzMTcuNiA4MCAyNTYgODBzLTExMiA1MC40LTExMiAxMTIgNTAuNCAxMTIgMTEyIDExMnptMCA0MGMtNzQuMiAwLTIyNCAzNy44LTIyNCAxMTJ2NTZoNDQ4di01NmMwLTc0LjItMTQ5LjgtMTEyLTIyNC0xMTJ6IiBmaWxsPSIjODJhZWZmIi8+PC9zdmc+"
            />
          </ion-avatar>
          <ion-label>Chip</ion-label>
          <ion-icon name="close-circle"></ion-icon>
        </ion-chip>`,
        config
      );

      const chip = page.locator('ion-chip');

      await expect(chip).toHaveScreenshot(screenshot(`chip-basic`));
    });
  });
});

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  /**
   * This behavior does not vary across modes/directions.
   */
  test.describe(title('chip: outline'), () => {
    test('should render default outline chip', async ({ page }) => {
      await page.setContent(
        `<ion-chip outline="true">
          <ion-icon name="checkmark-circle"></ion-icon>
          <ion-label>Icon</ion-label>
        </ion-chip>`,
        config
      );

      const chip = page.locator('ion-chip');

      await expect(chip).toHaveScreenshot(screenshot(`chip-outline`));
    });
  });
  /**
   * This behavior does not vary across modes/directions.
   */
  test.describe(title('chip: color'), () => {
    test('should render solid color chip', async ({ page }) => {
      await page.setContent(
        `<ion-chip color="tertiary">
          <ion-icon name="checkmark-circle"></ion-icon>
          <ion-label>Tertiary with Icon</ion-label>
        </ion-chip>`,
        config
      );

      const chip = page.locator('ion-chip');

      await expect(chip).toHaveScreenshot(screenshot(`chip-solid-color`));
    });
    test('should render outline color chip', async ({ page }) => {
      await page.setContent(
        `<ion-chip outline="true" color="tertiary">
          <ion-icon name="checkmark-circle"></ion-icon>
          <ion-label>Tertiary with Icon</ion-label>
        </ion-chip>`,
        config
      );

      const chip = page.locator('ion-chip');

      await expect(chip).toHaveScreenshot(screenshot(`chip-outline-color`));
    });
  });

  test.describe(title('chip: descenders'), () => {
    test('should not clip descenders in item', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/18313',
      });

      await page.setContent(
        `
        <ion-list>
          <ion-item>
            <ion-chip>
              <ion-label>Agreements</ion-label>
            </ion-chip>
          </ion-item>
        </ion-list>
      `,
        config
      );

      const chip = page.locator('ion-chip');

      await expect(chip).toHaveScreenshot(screenshot(`chip-descender`));
    });
  });
});

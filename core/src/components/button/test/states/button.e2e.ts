import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'], modes: ['ionic-md', 'md', 'ios'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: activated'), () => {
    test('should render solid button', async ({ page }) => {
      await page.setContent(
        `
        <ion-button class="ion-activated">Button</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-activated-solid`));
    });

    test('should render solid button with color', async ({ page }) => {
      await page.setContent(
        `
        <ion-button color="tertiary" class="ion-activated">Button</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-activated-solid-color`));
    });

    test('should render outline button', async ({ page }) => {
      await page.setContent(
        `
        <ion-button fill="outline" class="ion-activated">Button</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-activated-outline`));
    });

    test('should render outline button with color', async ({ page }) => {
      await page.setContent(
        `
        <ion-button color="tertiary" fill="outline" class="ion-activated">Button</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-activated-outline-color`));
    });

    test('should render clear button', async ({ page }) => {
      await page.setContent(
        `
        <ion-button fill="clear" class="ion-activated">Button</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-activated-clear`));
    });

    test('should render clear button with color', async ({ page }) => {
      await page.setContent(
        `
        <ion-button color="tertiary" fill="clear" class="ion-activated">Button</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-activated-clear-color`));
    });
  });
});

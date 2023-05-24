import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: wrap'), () => {
    test('should render button with long text', async ({ page }) => {
      await page.setContent(
        `
        <ion-button>This is the button that never ends it just goes on and on and on and on and on and on and on and on my friends</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-wrap`));
    });

    test('should render small button with long text', async ({ page }) => {
      await page.setContent(
        `
        <ion-button size="small">This is the button that never ends it just goes on and on and on and on and on and on and on and on my friends</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-wrap-small`));
    });

    test('should render large button with long text', async ({ page }) => {
      await page.setContent(
        `
        <ion-button size="large">This is the button that never ends it just goes on and on and on and on and on and on and on and on my friends</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-wrap-large`));
    });

    test('should render button with long text and icons', async ({ page }) => {
      await page.setContent(
        `
        <ion-button>
          <ion-icon slot="start" name="heart"></ion-icon>
          This is the button that never ends it just goes on and on and on and on and on and on and on and on my friends
          <ion-icon slot="end" name="star"></ion-icon>
        </ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-wrap-icons`));
    });

    test('should render block button with long text', async ({ page }) => {
      await page.setContent(
        `
        <ion-button expand="block">This is the button that never ends it just goes on and on and on and on and on and on and on and on my friends</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-wrap-block`));
    });

    test('should render block button with long text and icons', async ({ page }) => {
      await page.setContent(
        `
        <ion-button expand="block">
          <ion-icon slot="start" name="heart"></ion-icon>
          This is the button that never ends it just goes on and on and on and on and on and on and on and on my friends
          <ion-icon slot="end" name="star"></ion-icon>
        </ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-wrap-block-icons`));
    });

    test('should render full button with long text', async ({ page }) => {
      await page.setContent(
        `
        <ion-button expand="full">This is the button that never ends it just goes on and on and on and on and on and on and on and on my friends</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-wrap-full`));
    });

    test('should render full button with long text and icons', async ({ page }) => {
      await page.setContent(
        `
        <ion-button expand="full">
          <ion-icon slot="start" name="heart"></ion-icon>
          This is the button that never ends it just goes on and on and on and on and on and on and on and on my friends
          <ion-icon slot="end" name="star"></ion-icon>
        </ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-wrap-full-icons`));
    });
  });
});

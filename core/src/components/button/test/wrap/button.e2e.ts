import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('button: wrap'), () => {
    test('should render button with long text', async ({ page }) => {
      // TODO(FW-4599): remove ion-text-wrap class
      await page.setContent(
        `
        <ion-button class="ion-text-wrap">This is the button that never ends it just goes on and on and on and on and on and on and on and on my friends</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-wrap`));
    });

    test('should render small button with long text', async ({ page }) => {
      // TODO(FW-4599): remove ion-text-wrap class
      await page.setContent(
        `
        <ion-button class="ion-text-wrap" size="small">This is the button that never ends it just goes on and on and on and on and on and on and on and on my friends</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-wrap-small`));
    });

    test('should render large button with long text', async ({ page }) => {
      // TODO(FW-4599): remove ion-text-wrap class
      await page.setContent(
        `
        <ion-button class="ion-text-wrap" size="large">This is the button that never ends it just goes on and on and on and on and on and on and on and on my friends</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-wrap-large`));
    });

    test('should render button with long text and icons', async ({ page }) => {
      // TODO(FW-4599): remove ion-text-wrap class
      await page.setContent(
        `
        <ion-button class="ion-text-wrap">
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
      // TODO(FW-4599): remove ion-text-wrap class
      await page.setContent(
        `
        <ion-button class="ion-text-wrap" expand="block">This is the button that never ends it just goes on and on and on and on and on and on and on and on my friends</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-wrap-block`));
    });

    test('should render block button with long text and icons', async ({ page }) => {
      // TODO(FW-4599): remove ion-text-wrap class
      await page.setContent(
        `
        <ion-button class="ion-text-wrap" expand="block">
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
      // TODO(FW-4599): remove ion-text-wrap class
      await page.setContent(
        `
        <ion-button class="ion-text-wrap" expand="full">This is the button that never ends it just goes on and on and on and on and on and on and on and on my friends</ion-button>
      `,
        config
      );

      const button = page.locator('ion-button');

      await expect(button).toHaveScreenshot(screenshot(`button-wrap-full`));
    });

    test('should render full button with long text and icons', async ({ page }) => {
      // TODO(FW-4599): remove ion-text-wrap class
      await page.setContent(
        `
        <ion-button class="ion-text-wrap" expand="full">
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

    test('should render an item button with long text', async ({ page }) => {
      // TODO(FW-4599): remove ion-text-wrap class
      await page.setContent(
        `
        <ion-item>
          <ion-button class="ion-text-wrap" slot="end">
            This is the button that never ends it just goes on and on and on and on and on and on and on and on my friends
          </ion-button>
        </ion-item>
      `,
        config
      );

      const item = page.locator('ion-item');

      await expect(item).toHaveScreenshot(screenshot(`button-wrap-item-button`));
    });

    test('should render an item button with long text and icons', async ({ page }) => {
      // TODO(FW-4599): remove ion-text-wrap class
      await page.setContent(
        `
        <ion-item>
          <ion-button class="ion-text-wrap" slot="end">
            <ion-icon slot="start" name="heart"></ion-icon>
            This is the button that never ends it just goes on and on and on and on and on and on and on and on my friends
            <ion-icon slot="end" name="star"></ion-icon>
          </ion-button>
        </ion-item>
      `,
        config
      );

      const item = page.locator('ion-item');

      await expect(item).toHaveScreenshot(screenshot(`button-wrap-item-button-icons`));
    });

    test('should render a list header button with long text', async ({ page }) => {
      // TODO(FW-4599): remove ion-text-wrap class
      await page.setContent(
        `
        <ion-list-header>
          <ion-label>List Header</ion-label>
          <ion-button class="ion-text-wrap">
            This is the button that never ends it just goes on and on and on and on and on and on and on and on my friends
          </ion-button>
        </ion-list-header>
      `,
        config
      );

      const listHeader = page.locator('ion-list-header');

      await expect(listHeader).toHaveScreenshot(screenshot(`button-wrap-list-header-button`));
    });

    test('should render a toolbar button with long text', async ({ page }) => {
      // TODO(FW-4599): remove ion-text-wrap class
      await page.setContent(
        `
        <ion-toolbar>
          <ion-buttons slot="end">
            <ion-button class="ion-text-wrap">
              This is the button that never ends it just goes on and on and on and on and on and on and on and on my friends
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      `,
        config
      );

      const toolbar = page.locator('ion-toolbar');

      await expect(toolbar).toHaveScreenshot(screenshot(`button-wrap-toolbar-button`));
    });
  });
});

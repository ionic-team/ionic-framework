import { expect } from '@playwright/test';
import { configs, keepSafariHairlines, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('item: lines'), () => {
    keepSafariHairlines(config);

    test.describe('default', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-item>
            <ion-label>Label</ion-label>
          </ion-item>
        `,
          config
        );

        const item = page.locator('ion-item');

        await expect(item).toHaveScreenshot(screenshot(`item-lines-default`));
      });

      test('should not have visual regressions with slotted icons', async ({ page }) => {
        await page.setContent(
          `
          <ion-item>
            <ion-icon name="star" slot="start"></ion-icon>
            <ion-label>Label</ion-label>
            <ion-icon name="information-circle" slot="end"></ion-icon>
          </ion-item>
        `,
          config
        );

        const item = page.locator('ion-item');

        await expect(item).toHaveScreenshot(screenshot(`item-lines-default-icon`));
      });

      test('should not have visual regressions with color', async ({ page }) => {
        await page.setContent(
          `
          <ion-item color="danger">
            <ion-icon name="star" slot="start"></ion-icon>
            <ion-label>Label</ion-label>
            <ion-icon name="information-circle" slot="end"></ion-icon>
          </ion-item>
        `,
          config
        );

        const item = page.locator('ion-item');

        await expect(item).toHaveScreenshot(screenshot(`item-lines-color`));
      });
    });

    test.describe('inset', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-item lines="inset">
            <ion-label>Label</ion-label>
          </ion-item>
        `,
          config
        );

        const item = page.locator('ion-item');

        await expect(item).toHaveScreenshot(screenshot(`item-lines-inset`));
      });

      test('should not have visual regressions with slotted icons', async ({ page }) => {
        await page.setContent(
          `
          <ion-item lines="inset">
            <ion-icon name="star" slot="start"></ion-icon>
            <ion-label>Label</ion-label>
            <ion-icon name="information-circle" slot="end"></ion-icon>
          </ion-item>
        `,
          config
        );

        const item = page.locator('ion-item');

        await expect(item).toHaveScreenshot(screenshot(`item-lines-inset-icon`));
      });

      test('should not have visual regressions with color', async ({ page }) => {
        await page.setContent(
          `
          <ion-item lines="inset" color="danger">
            <ion-icon name="star" slot="start"></ion-icon>
            <ion-label>Label</ion-label>
            <ion-icon name="information-circle" slot="end"></ion-icon>
          </ion-item>
        `,
          config
        );

        const item = page.locator('ion-item');

        await expect(item).toHaveScreenshot(screenshot(`item-lines-inset-color`));
      });
    });

    test.describe('full', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-item lines="full">
            <ion-label>Label</ion-label>
          </ion-item>
        `,
          config
        );

        const item = page.locator('ion-item');

        await expect(item).toHaveScreenshot(screenshot(`item-lines-full`));
      });

      test('should not have visual regressions with slotted icons', async ({ page }) => {
        await page.setContent(
          `
          <ion-item lines="full">
            <ion-icon name="star" slot="start"></ion-icon>
            <ion-label>Label</ion-label>
            <ion-icon name="information-circle" slot="end"></ion-icon>
          </ion-item>
        `,
          config
        );

        const item = page.locator('ion-item');

        await expect(item).toHaveScreenshot(screenshot(`item-lines-full-icon`));
      });

      test('should not have visual regressions with color', async ({ page }) => {
        await page.setContent(
          `
          <ion-item lines="full" color="danger">
            <ion-icon name="star" slot="start"></ion-icon>
            <ion-label>Label</ion-label>
            <ion-icon name="information-circle" slot="end"></ion-icon>
          </ion-item>
        `,
          config
        );

        const item = page.locator('ion-item');

        await expect(item).toHaveScreenshot(screenshot(`item-lines-full-color`));
      });
    });

    test.describe('none', () => {
      test('should not have visual regressions', async ({ page }) => {
        await page.setContent(
          `
          <ion-item lines="none">
            <ion-label>Label</ion-label>
          </ion-item>
        `,
          config
        );

        const item = page.locator('ion-item');

        await expect(item).toHaveScreenshot(screenshot(`item-lines-none`));
      });

      test('should not have visual regressions with slotted icons', async ({ page }) => {
        await page.setContent(
          `
          <ion-item lines="none">
            <ion-icon name="star" slot="start"></ion-icon>
            <ion-label>Label</ion-label>
            <ion-icon name="information-circle" slot="end"></ion-icon>
          </ion-item>
        `,
          config
        );

        const item = page.locator('ion-item');

        await expect(item).toHaveScreenshot(screenshot(`item-lines-none-icon`));
      });

      test('should not have visual regressions with color', async ({ page }) => {
        await page.setContent(
          `
          <ion-item lines="none" color="danger">
            <ion-icon name="star" slot="start"></ion-icon>
            <ion-label>Label</ion-label>
            <ion-icon name="information-circle" slot="end"></ion-icon>
          </ion-item>
        `,
          config
        );

        const item = page.locator('ion-item');

        await expect(item).toHaveScreenshot(screenshot(`item-lines-none-color`));
      });
    });
  });
});

/**
 * Snapshots shrink the page to CSS pixels, which can drop a one-device-pixel
 * ios line in Safari when an item sits at a fractional position. This test
 * keeps every device pixel, so a missing, thicker or misplaced line fails in
 * every browser. Only the ios theme draws lines thinner than one CSS pixel.
 * This behavior does not vary across directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('item: lines at device resolution'), () => {
    test('should not have visual regressions', async ({ page }) => {
      // The groups start 0, 1/3 and 2/3 of a pixel down the page
      const group = (offset: string) => `
        <div style="padding-top: ${offset}">
          <ion-item><ion-label>Inset</ion-label></ion-item>
          <ion-item lines="full"><ion-label>Full</ion-label></ion-item>
          <ion-item lines="full" color="danger"><ion-label>Color</ion-label></ion-item>
        </div>
      `;

      await page.setContent(
        `
        <style>
          #container {
            width: 120px;
          }
        </style>
        <div id="container">${group('0px')}${group('0.33px')}${group('0.34px')}</div>
        `,
        config
      );

      const container = page.locator('#container');

      await expect(container).toHaveScreenshot(screenshot(`item-lines-device`), { scale: 'device' });
    });
  });
});

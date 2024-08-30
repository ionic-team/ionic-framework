import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios', 'md', 'ionic-md'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('item: lines'), () => {
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

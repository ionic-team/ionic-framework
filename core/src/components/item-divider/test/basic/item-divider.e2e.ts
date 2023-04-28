import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('item-divider: basic'), () => {
    test('should display an item divider with text', async ({ page }) => {
      await page.setContent(
        `
        <ion-item-divider>
          <ion-label>Item Divider</ion-label>
        </ion-item-divider>
      `,
        config
      );

      const divider = page.locator('ion-item-divider');
      await expect(divider).toHaveScreenshot(screenshot(`item-divider-text`));
    });

    test('should display an item divider with a button in the end slot', async ({ page }) => {
      await page.setContent(
        `
        <ion-item-divider>
          <ion-label>Item Divider</ion-label>
          <ion-button slot="end">Button</ion-button>
        </ion-item-divider>
      `,
        config
      );

      const divider = page.locator('ion-item-divider');
      await expect(divider).toHaveScreenshot(screenshot(`item-divider-button-end`));
    });

    test('should display an item divider with an icon in the start slot', async ({ page }) => {
      await page.setContent(
        `
        <ion-item-divider>
          <ion-icon slot="start" name="star"></ion-icon>
          <ion-label>Item Divider</ion-label>
        </ion-item-divider>
      `,
        config
      );

      const divider = page.locator('ion-item-divider');
      await expect(divider).toHaveScreenshot(screenshot(`item-divider-icon-start`));
    });
  });
});

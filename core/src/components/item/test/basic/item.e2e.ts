import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('item: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/item/test/basic`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`item-diff`));
    });

    /**
     * This behavior needs to be tested for all modes & directions
     * Safe padding should stay on the same side when the direction changes
     */
    test('should have safe area padding', async ({ page }) => {
      await page.setContent(
        `
        <style>
          :root {
            --ion-safe-area-left: 40px;
            --ion-safe-area-right: 20px;
          }
        </style>
        <ion-list>
          <ion-item>
            <ion-label>Item</ion-label>
          </ion-item>

          <ion-item>
            <ion-label class="ion-text-nowrap"> Single line text that should have ellipses when it doesn't all fit in the item</ion-label>
          </ion-item>
        </ion-list>
      `,
        config
      );

      const list = page.locator('ion-list');

      await expect(list).toHaveScreenshot(screenshot('item-safe-area'));
    });
  });
});

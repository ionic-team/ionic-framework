import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('item: buttons'), () => {
    test('should not have visual regressions', async ({ page }) => {
      /**
       * This test validates that in iOS mode the arrow indicators are
       * added to the end of the ion-item row.
       *
       * In MD mode, these arrow indicators are not present.
       */
      await page.goto(`/src/components/item/test/buttons`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`item-buttons-diff`));
    });
  });
});

configs({ directions: ['ltr'], palettes: ['dark'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('item: buttons dark'), () => {
    test('should not have visual regressions in dark', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/27130',
      });

      await page.setContent(
        `
        <ion-list>
          <ion-item button="true">
            <ion-label>Button Item</ion-label>
          </ion-item>
          <ion-item button="true" class="ion-activated">
            <ion-label>Activated Button Item</ion-label>
          </ion-item>
          <ion-item button="true" class="ion-focused">
            <ion-label>Focused Button Item</ion-label>
          </ion-item>
        </ion-list>
      `,
        config
      );

      const list = page.locator('ion-list');

      await expect(list).toHaveScreenshot(screenshot(`item-buttons-dark-diff`));
    });
  });
});

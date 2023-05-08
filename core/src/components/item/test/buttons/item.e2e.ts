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

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('item: buttons dark'), () => {
    test('should not have visual regressions in dark', async ({ page }) => {
      await page.goto(`/src/components/item/test/buttons?dark=true`, config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`item-buttons-dark-diff`));
    });
  });
});

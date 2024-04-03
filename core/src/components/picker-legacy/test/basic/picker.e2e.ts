import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('picker: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/picker-legacy/test/basic', config);
      const didPresent = await page.spyOnEvent('ionPickerDidPresent');
      const didDismiss = await page.spyOnEvent('ionPickerDidDismiss');

      await page.click('#basic');
      await didPresent.next();
      await page.waitForChanges();

      await expect(page).toHaveScreenshot(screenshot(`picker-basic`));

      await page.click('.picker-opt:nth-child(2)');
      await page.click('ion-picker-legacy .save-btn');
      await didDismiss.next();

      await page.click('#basic');
      await didPresent.next();
      await page.waitForChanges();

      await expect(page).toHaveScreenshot(screenshot(`picker-value-selected`));
    });
  });
});

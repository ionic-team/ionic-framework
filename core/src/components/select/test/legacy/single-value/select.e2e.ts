import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('select: single-value'), () => {
    test('should open single value select', async ({ page }) => {
      await page.goto(`/src/components/select/test/legacy/single-value`, config);

      const ionAlertDidPresent = await page.spyOnEvent('ionAlertDidPresent');

      await page.click('#gender');

      await ionAlertDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`select-single-value-diff`));
    });
  });
});

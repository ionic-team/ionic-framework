import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('picker-column'), () => {
    test('should present picker without ion-app', async ({ page }) => {
      await page.goto('/src/components/picker-column/test/standalone', config);

      const ionPickerDidPresent = await page.spyOnEvent('ionPickerDidPresent');

      const picker = page.locator('ion-picker');

      await page.click('#single-column-button');

      await ionPickerDidPresent.next();

      await expect(picker).toBeVisible();
    });
  });
});

import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('checkbox: color'), () => {
    test('should apply color when checked', async ({ page }) => {
      await page.setContent(
        `
        <ion-checkbox color="danger" checked="true">Label</ion-checkbox>
      `,
        config
      );

      const checkbox = page.locator('ion-checkbox');
      expect(await checkbox.screenshot()).toMatchSnapshot(screenshot(`checkbox-color-checked`));
    });

    test('should not apply color when unchecked', async ({ page }) => {
      await page.setContent(
        `
        <ion-checkbox color="danger">Label</ion-checkbox>
      `,
        config
      );

      const checkbox = page.locator('ion-checkbox');
      expect(await checkbox.screenshot()).toMatchSnapshot(screenshot(`checkbox-color-unchecked`));
    });
  });
});

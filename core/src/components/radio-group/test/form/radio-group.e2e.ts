import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe('radio-group: form', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/src/components/radio-group/test/form', config);
    });

    test(title('selecting an option should update the value'), async ({ page }) => {
      const radioGroup = page.locator('ion-radio-group');
      const ionChange = await page.spyOnEvent('ionChange');
      const griffRadio = page.locator('ion-radio[value="griff"]');

      await expect(radioGroup).toHaveAttribute('value', 'biff');

      await griffRadio.click();
      await page.waitForChanges();

      await expect(ionChange).toHaveReceivedEventDetail({ value: 'griff' });
    });

    test(title('selecting a disabled option should not update the value'), async ({ page }) => {
      const value = page.locator('#value');
      const disabledRadio = page.locator('ion-radio[value="george"]');

      await expect(value).toHaveText('');
      await expect(disabledRadio).toHaveAttribute('disabled', '');

      await disabledRadio.click({ force: true });
      await page.waitForChanges();

      await expect(value).toHaveText('');
    });
  });
});

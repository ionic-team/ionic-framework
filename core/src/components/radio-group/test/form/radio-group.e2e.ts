import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('radio-group: form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/radio-group/test/form');
  });

  test('selecting an option should update the value', async ({ page }) => {
    const value = page.locator('#value');
    const griffRadio = page.locator('ion-radio[value="griff"]');

    await expect(value).toHaveText('');

    await griffRadio.click();

    await expect(value).toHaveText('griff');
  });

  test('selecting a disabled option should not update the value', async ({ page }) => {
    const value = page.locator('#value');
    const disabledRadio = page.locator('ion-radio[value="george"]');

    await expect(value).toHaveText('');
    await expect(disabledRadio).toHaveAttribute('disabled', '');

    await disabledRadio.click({ force: true });

    await expect(value).toHaveText('');
  });
});

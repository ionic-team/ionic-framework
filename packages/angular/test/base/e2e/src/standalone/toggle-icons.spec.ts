import { expect, test } from '@playwright/test';

test.describe('Toggle: custom icons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standalone/toggle-icons');
  });

  test('should pass the checkedIcon and uncheckedIcon inputs to the toggle', async ({ page }) => {
    const toggle = page.locator('ion-toggle#custom-icons');

    await expect(toggle).toHaveJSProperty('checkedIcon', 'moon');
    await expect(toggle).toHaveJSProperty('uncheckedIcon', 'sunny');
  });
});

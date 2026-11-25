import { expect, test } from '@playwright/test';

test.describe('Toggle: custom icons', () => {
  test.beforeEach(async ({ page }) => {
    // iOS renders both icons, so both inputs can be checked.
    await page.goto('/standalone/toggle-icons?ionic:mode=ios');
  });

  test('should render the icons passed through the checkedIcon and uncheckedIcon inputs', async ({ page }) => {
    const toggle = page.locator('ion-toggle#custom-icons');

    await expect(toggle.locator('ion-icon.toggle-switch-icon-checked')).toHaveJSProperty('icon', 'moon');
    await expect(toggle.locator('ion-icon.toggle-switch-icon:not(.toggle-switch-icon-checked)')).toHaveJSProperty(
      'icon',
      'sunny'
    );
  });
});

import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe(title('toast: cancel button'), () => {
    test('should render the cancel button with part button-cancel', async ({ page }) => {
      await page.goto('/src/components/toast/test/buttons', config);

      const toast = page.locator('#closeArray');
      await toast.click();

      const buttonCancel = page.locator('.toast-button-cancel');
      await expect(buttonCancel).toHaveAttribute('part', 'button-cancel');
    });
  });
});

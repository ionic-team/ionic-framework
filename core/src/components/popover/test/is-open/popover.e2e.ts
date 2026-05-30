import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('popover: isOpen'), () => {
    test('should open if isOpen is true on load', async ({ page }) => {
      await page.setContent('<ion-popover is-open="true"></ion-popover>', config);
      await expect(page.locator('ion-popover')).toBeVisible();
    });
  });
});

import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ config, screenshot, title }) => {
  test.describe(title('avatar: basic'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto(`/src/components/avatar/test/basic`, config);

      const avatar = page.locator('#avatar');
      const avatarChip = page.locator('#avatar-chip');
      const avatarItemStart = page.locator('#avatar-item-start');
      const avatarItemEnd = page.locator('#avatar-item-end');

      await expect(avatar).toHaveScreenshot(screenshot(`avatar-diff`));
      await expect(avatarChip).toHaveScreenshot(screenshot(`avatar-chip-diff`));
      await expect(avatarItemStart).toHaveScreenshot(screenshot(`avatar-item-start-diff`));
      await expect(avatarItemEnd).toHaveScreenshot(screenshot(`avatar-item-end-diff`));
    });
  });
});

import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Translucent effect is only available in iOS mode.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('header: fade'), () => {
    test('should not have visual regressions with fade header', async ({ page }) => {
      await page.goto('/src/components/header/test/fade', config);

      const header = page.locator('ion-header');
      await expect(header).toHaveScreenshot(screenshot(`header-fade-not-blurred-diff`));

      const content = page.locator('ion-content');
      await content.evaluate((el: HTMLIonContentElement) => el.scrollToBottom(0));
      await page.waitForChanges();

      await expect(header).toHaveScreenshot(screenshot(`header-fade-blurred-diff`));
    });
  });
});

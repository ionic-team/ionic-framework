import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ config, screenshot, title }) => {
  test.describe(title('divider: rendering'), () => {
    test('should not have visual regressions', async ({ page }) => {
      await page.goto('/src/components/divider/test/basic', config);

      await page.setIonViewport();

      await expect(page).toHaveScreenshot(screenshot(`divider-basic`));
    });
  });
});

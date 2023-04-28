import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('modal: custom dialog'), () => {
    test('should size custom modal correctly', async ({ page }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/24080',
      });

      await page.goto('/src/components/modal/test/custom-dialog', config);
      const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

      await page.click('#custom-modal');

      await ionModalDidPresent.next();

      await expect(page).toHaveScreenshot(screenshot(`modal-custom-dialog`));
    });
  });
});

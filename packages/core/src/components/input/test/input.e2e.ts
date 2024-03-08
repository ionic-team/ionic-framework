import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

/**
 * Rendering is the same across platforms
 */
configs({ modes: ['md'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('input: rendering'), () => {
    test('should not render the label element if no label was passed', async ({ page }) => {
      await page.setContent(`<ion-input aria-label="my hidden label"></ion-label>`, config);

      const label = page.locator('ion-input .label-text-wrapper');
      await expect(label).toBeHidden();
    });
  });
});

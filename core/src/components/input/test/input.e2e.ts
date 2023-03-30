import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: rendering', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
    skip.mode('ios', 'Rendering is the same across platforms');
  });

  test('should not render the label element if no label was passed', async ({ page }) => {
    await page.setContent(`<ion-input aria-label="my hidden label"></ion-label>`);

    const label = page.locator('ion-input .label-text-wrapper');
    await expect(label).toBeHidden();
  });
});

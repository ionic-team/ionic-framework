import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('modal: trigger', () => {
  test('should open modal by left clicking on trigger', async ({ page }) => {
    await page.goto('/src/components/modal/test/trigger');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    await page.click('#left-click-trigger');

    await ionModalDidPresent.next();

    const modal = await page.locator('.left-click-modal');
    await expect(modal).toBeVisible();
  });
});

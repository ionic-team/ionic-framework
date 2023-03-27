import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item-sliding: async', () => {
  test('should open even when item is added async', async ({ page, skip }) => {
    skip.rtl();
    skip.mode('md');

    await page.goto(`/src/components/item-sliding/test/async`);

    const itemEl = page.locator('ion-item');
    const itemSlidingEl = page.locator('ion-item-sliding');

    // Wait for item to be added to DOM
    await page.waitForSelector('#custom-item');

    // Click item to open ion-item-sliding
    await itemEl.click();

    // This class is added when the item sliding component is fully open
    await expect(itemSlidingEl).toHaveClass(/item-sliding-active-slide/);
  });
});

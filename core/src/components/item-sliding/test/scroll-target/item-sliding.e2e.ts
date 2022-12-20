import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item-sliding: scroll-target', () => {
  // TODO FW-3006
  test.skip('should not scroll when the item-sliding is swiped in custom scroll target', async ({ page, skip }) => {
    skip.browser('webkit', 'mouse.wheel is not available in WebKit');
    skip.rtl();

    await page.goto(`/src/components/item-sliding/test/scroll-target`);

    const itemSlidingEl = page.locator('ion-item-sliding');
    const scrollEl = page.locator('.ion-content-scroll-host');

    expect(await scrollEl.evaluate((el: HTMLElement) => el.scrollTop)).toEqual(0);

    const box = (await itemSlidingEl.boundingBox())!;
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.mouse.move(centerX - 30, centerY);

    /**
     * Do not use scrollToBottom() or other scrolling methods
     * on ion-content as those will update the scroll position.
     * Setting scrollTop still works even with overflow-y: hidden.
     * However, simulating a user gesture should not scroll the content.
     */
    await page.mouse.wheel(0, 100);
    await page.waitForChanges();

    expect(await scrollEl.evaluate((el: HTMLElement) => el.scrollTop)).toEqual(0);
  });
});

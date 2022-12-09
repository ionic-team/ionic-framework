import { expect } from '@playwright/test';
import { dragElementBy, test } from '@utils/test/playwright';

import { testSlidingItem } from '../test.utils';

test.describe('item-sliding: basic', () => {
  test.beforeEach(async ({ skip }) => {
    skip.mode('ios', "item-sliding doesn't have mode-specific styling");
  });

  test('should not have visual regressions', async ({ page, browserName }, testInfo) => {
    // TODO(FW-2608)
    test.fixme(
      testInfo.project.metadata.rtl === true && (browserName === 'firefox' || browserName === 'webkit'),
      'https://github.com/ionic-team/ionic-framework/issues/26103'
    );

    await page.goto(`/src/components/item-sliding/test/basic`);
    const item = page.locator('#item2');

    await testSlidingItem(page, item, 'start', true);
    await testSlidingItem(page, item, 'end');
  });

  // mouse gesture is flaky on CI, skip for now
  test.fixme('should open when swiped', async ({ page, skip }) => {
    skip.rtl();
    skip.browser(
      (browserName: string) => browserName !== 'chromium',
      'dragElementBy is flaky outside of Chrome browsers.'
    );

    await page.goto(`/src/components/item-sliding/test/basic`);
    const item = page.locator('#item2');

    await dragElementBy(item, page, -150);
    await page.waitForChanges();

    // item-sliding doesn't have an easy way to tell whether it's fully open so just screenshot it
    expect(await item.screenshot()).toMatchSnapshot(`item-sliding-gesture-${page.getSnapshotSettings()}.png`);
  });

  // TODO FW-3006
  test.skip('should not scroll when the item-sliding is swiped', async ({ page, skip }) => {
    skip.browser('webkit', 'mouse.wheel is not available in WebKit');
    skip.rtl();

    await page.goto(`/src/components/item-sliding/test/basic`);

    const itemSlidingEl = page.locator('#item2');
    const scrollEl = page.locator('ion-content .inner-scroll');

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

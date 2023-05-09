import AxeBuilder from '@axe-core/playwright';
import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

configs().forEach(({ title, config }) => {
  test.describe(title('segment: a11y'), () => {
    test('should not have any axe violations', async ({ page }) => {
      await page.goto('/src/components/segment/test/a11y', config);

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });

    // TODO FW-3710
    test.skip('segment buttons should be keyboard navigable', async ({ page, browserName, skip }, testInfo) => {
      // TODO (FW-2979)
      skip.browser('webkit', 'Safari 16 only allows text fields and pop-up menus to be focused.');
      const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
      const isRTL = testInfo.project.metadata.rtl === true;
      const nextKey = isRTL ? 'ArrowLeft' : 'ArrowRight';
      const previousKey = isRTL ? 'ArrowRight' : 'ArrowLeft';

      await page.goto('/src/components/segment/test/a11y', config);

      const segmentButtons = page.locator('ion-segment-button');

      await page.keyboard.press(tabKey);
      await expect(segmentButtons.nth(0)).toBeFocused();

      await page.keyboard.press(nextKey);
      await expect(segmentButtons.nth(1)).toBeFocused();

      await page.keyboard.press(previousKey);
      await expect(segmentButtons.nth(0)).toBeFocused();

      await page.keyboard.press('End');
      await expect(segmentButtons.nth(2)).toBeFocused();

      await page.keyboard.press('Home');
      await expect(segmentButtons.nth(0)).toBeFocused();

      // Loop to the end from the start
      await page.keyboard.press(previousKey);
      await expect(segmentButtons.nth(2)).toBeFocused();

      // Loop to the start from the end
      await page.keyboard.press(nextKey);
      await expect(segmentButtons.nth(0)).toBeFocused();
    });
  });
});

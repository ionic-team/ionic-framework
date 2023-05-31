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

    test('segment buttons should be keyboard navigable', async ({ page, pageUtils }) => {
      const isRTL = config.direction === 'rtl';
      const nextKey = isRTL ? 'ArrowLeft' : 'ArrowRight';
      const previousKey = isRTL ? 'ArrowRight' : 'ArrowLeft';

      // In order to avoid flaky tests, we need to make sure the page does
      // not have another segment group.
      // Otherwise, the focus state may get stuck in the middle of transition.
      await page.setContent(`<ion-segment aria-label="Tab Options" color="dark" select-on-focus>
      <ion-segment-button value="bookmarks">
        <ion-label>Bookmarks</ion-label>
      </ion-segment-button>
      <ion-segment-button value="reading-list">
        <ion-label>Reading List</ion-label>
      </ion-segment-button>
      <ion-segment-button value="shared-links">
        <ion-label>Shared Links</ion-label>
      </ion-segment-button>
    </ion-segment>`, config);

      const segmentButtons = page.locator('ion-segment-button');

      await pageUtils.pressKeys('Tab');
      await expect(segmentButtons.nth(0)).toBeFocused();

      await page.keyboard.press(nextKey);
      await expect(segmentButtons.nth(1)).toBeFocused();

      await page.keyboard.press(previousKey);
      await expect(segmentButtons.nth(0)).toBeFocused();

      await page.keyboard.press('End');
      await expect(segmentButtons.nth(2)).toBeFocused();

      await page.keyboard.press('Home');
      await expect(segmentButtons.nth(0)).toBeFocused();

      // // Loop to the end from the start
      await page.keyboard.press(previousKey);
      await expect(segmentButtons.nth(2)).toBeFocused();

      // // Loop to the start from the end
      await page.keyboard.press(nextKey);
      await expect(segmentButtons.nth(0)).toBeFocused();
    });
  });
});

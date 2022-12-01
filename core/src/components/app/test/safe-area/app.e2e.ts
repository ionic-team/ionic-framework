import { expect } from '@playwright/test';
import { test, configs } from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

configs({ directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe('app: safe-area', () => {
    const testOverlay = async (page: E2EPage, trigger: string, event: string, screenshotModifier: string) => {
      const presentEvent = await page.spyOnEvent(event);

      await page.click(trigger);
      await presentEvent.next();

      // Sometimes the inner content takes a frame or two to render
      await page.waitForChanges();

      expect(await page.screenshot()).toMatchSnapshot(
        `app-${screenshotModifier}-diff-${page.getSnapshotSettings()}.png`
      );
    };
    test.beforeEach(async ({ page }) => {
      await page.goto(`/src/components/app/test/safe-area`, config);
    });
    test(title('should not have visual regressions with action sheet'), async ({ page }) => {
      await testOverlay(page, '#show-action-sheet', 'ionActionSheetDidPresent', 'action-sheet');
    });
    test(title('should not have visual regressions with menu'), async ({ page }) => {
      await testOverlay(page, '#show-menu', 'ionDidOpen', 'menu');
    });
    test(title('should not have visual regressions with picker'), async ({ page }) => {
      await testOverlay(page, '#show-picker', 'ionPickerDidPresent', 'picker');
    });
    test(title('should not have visual regressions with toast'), async ({ page }) => {
      await testOverlay(page, '#show-toast', 'ionToastDidPresent', 'toast');
    });
  });
});

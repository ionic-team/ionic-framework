import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';
import type { E2EPage } from '@utils/test/playwright';

test.describe('app: safe-area', () => {
  const testOverlay = async (page: E2EPage, trigger: string, event: string, screenshotModifier: string) => {
    const presentEvent = await page.spyOnEvent(event);

    await page.click(trigger);
    await presentEvent.next();

    // Sometimes the inner content takes a frame or two to render
    await page.waitForChanges();

    expect(await page.screenshot()).toMatchSnapshot(`app-${screenshotModifier}-diff-${page.getSnapshotSettings()}.png`);
  };
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.metadata.rtl === true,
      'Safe area tests only check top and bottom edges. RTL checks are not required here.'
    );

    await page.goto(`/src/components/app/test/safe-area`);
  });
  test('should not have visual regressions with action sheet', async ({ page }) => {
    await testOverlay(page, '#show-action-sheet', 'ionActionSheetDidPresent', 'action-sheet');
  });
  test('should not have visual regressions with menu', async ({ page }) => {
    await testOverlay(page, '#show-menu', 'ionDidOpen', 'menu');
  });
  test('should not have visual regressions with picker', async ({ page }) => {
    await testOverlay(page, '#show-picker', 'ionPickerDidPresent', 'picker');
  });
  test('should not have visual regressions with toast', async ({ page }) => {
    await testOverlay(page, '#show-toast', 'ionToastDidPresent', 'toast');
  });
});

import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('footer: with tabs', () => {
  test('should not have extra padding when near a tab bar', async ({ page }, testInfo) => {
    test.skip(testInfo.project.metadata.rtl === true, 'This does not test LTR vs. RTL layout.');

    await page.goto('/src/components/footer/test/with-tabs');

    const footer = page.locator('[tab="tab-one"] ion-footer');
    await expect(footer).toHaveScreenshot(`footer-with-tabs-${page.getSnapshotSettings()}.png`);
  });
});

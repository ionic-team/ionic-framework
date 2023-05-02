import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('title: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/title/test/basic');
    const wrapper = page.locator('#header-wrapper');

    // only screenshot the headers to avoid unnecessary blank space from ion-content
    await expect(wrapper).toHaveScreenshot(`title-basic-${page.getSnapshotSettings()}.png`);
  });
});

import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('toolbar: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/toolbar/test/basic`);

    // capture both header toolbars at once, but don't include all the white space in the ion-content
    const header = page.locator('ion-header');
    await expect(header).toHaveScreenshot(`toolbar-basic-${page.getSnapshotSettings()}.png`);
  });
});

import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('breadcrumbs: basic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/breadcrumbs/test/basic');
  });

  test('should not have visual regressions', async ({ page }) => {
    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`breadcrumb-diff-${page.getSnapshotSettings()}.png`);
  });

  test('should have color attribute', async ({ page }) => {
    test.info().annotations.push({
      type: 'issue',
      description: 'https://github.com/ionic-team/ionic-framework/issues/25446',
    });

    const breadcrumbs = page.locator('#color');

    expect(await breadcrumbs.getAttribute('color')).not.toBe(null);
  });
});

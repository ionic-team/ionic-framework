import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('input: spec', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/input/test/legacy/spec');
  });

  test('should not have visual regressions', async ({ page }) => {
    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`input-spec-diff-${page.getSnapshotSettings()}.png`);
  });
});

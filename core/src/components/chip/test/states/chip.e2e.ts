import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('chip: states', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/chip/test/states');

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`chip-states-${page.getSnapshotSettings()}.png`);
  });
});

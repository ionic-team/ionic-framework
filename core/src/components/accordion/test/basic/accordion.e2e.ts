import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('accordion: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/accordion/test/basic`);

    await page.setIonViewport();

    await expect(page).toHaveScreenshot(`accordion-basic-${page.getSnapshotSettings()}.png`);
  });
});

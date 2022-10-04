import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item-divider: spec', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/components/item-divider/test/spec');
  });

  test('should not have visual regressions', async ({ page }) => {
    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`list-item-divider-${page.getSnapshotSettings()}.png`);
  });
});

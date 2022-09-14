import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: fill', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/fill`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`item-fill-diff-${page.getSnapshotSettings()}.png`);
  });
});

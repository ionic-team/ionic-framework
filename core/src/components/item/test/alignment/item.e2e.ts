import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: alignment', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/alignment`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`item-alignment-diff-${page.getSnapshotSettings()}.png`);
  });
});

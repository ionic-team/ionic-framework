import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: images', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/images`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`item-images-diff-${page.getSnapshotSettings()}.png`);
  });
});

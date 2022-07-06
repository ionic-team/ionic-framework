import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: media', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/media`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`item-media-diff-${page.getSnapshotSettings()}.png`);
  });
});

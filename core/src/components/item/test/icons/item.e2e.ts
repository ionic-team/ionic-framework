import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: icons', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/icons`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`item-icons-diff-${page.getSnapshotSettings()}.png`);
  });
});

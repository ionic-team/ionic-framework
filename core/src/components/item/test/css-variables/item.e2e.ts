import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: CSS variables', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/css-variables`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`item-css-vars-diff-${page.getSnapshotSettings()}.png`);
  });
});

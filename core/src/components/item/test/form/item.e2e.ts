import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('item: form', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/item/test/form`);

    await page.setIonViewport({ resizeViewportWidth: true });

    expect(await page.screenshot()).toMatchSnapshot(`item-form-diff-${page.getSnapshotSettings()}.png`);
  });
});

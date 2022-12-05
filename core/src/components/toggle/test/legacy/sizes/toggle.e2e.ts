import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('toggle: sizes', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/toggle/test/legacy/sizes`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`toggle-sizes-diff-${page.getSnapshotSettings()}.png`);
  });
});

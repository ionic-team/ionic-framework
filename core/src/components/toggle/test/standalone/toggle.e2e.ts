import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('toggle: standalone', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/toggle/test/standalone`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`toggle-standalone-diff-${page.getSnapshotSettings()}.png`);
  });
});

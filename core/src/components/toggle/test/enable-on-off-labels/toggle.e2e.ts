import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('toggle: enableOnOffLabels', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/src/components/toggle/test/enable-on-off-labels`);
  });

  test('should not have visual regressions', async ({ page }) => {
    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`toggle-on-off-labels-diff-${page.getSnapshotSettings()}.png`);
  });
});

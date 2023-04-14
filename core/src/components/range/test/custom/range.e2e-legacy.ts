import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('range: customization', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should be customizable', async ({ page }) => {
    await page.goto(`/src/components/range/test/custom`);

    const range = page.locator('ion-range');
    expect(await range.screenshot()).toMatchSnapshot(`range-custom-${page.getSnapshotSettings()}.png`);
  });
});

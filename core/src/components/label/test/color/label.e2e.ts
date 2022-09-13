import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('label: rendering', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should not inherit color from content', async ({ page }) => {
    await page.goto(`/src/components/label/test/color`);

    const item = page.locator('ion-item');

    expect(await item.screenshot()).toMatchSnapshot(`item-color-inherit-${page.getSnapshotSettings()}.png`);
  });
});

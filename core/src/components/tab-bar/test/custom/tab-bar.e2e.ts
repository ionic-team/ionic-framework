import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('tab-bar: custom', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should render custom tab bar', async ({ page }) => {
    await page.goto('/src/components/tab-bar/test/custom');

    const tabBar = page.locator('ion-tab-bar.custom-all');

    expect(await tabBar.screenshot()).toMatchSnapshot(`tab-bar-custom-${page.getSnapshotSettings()}.png`);
  });
});

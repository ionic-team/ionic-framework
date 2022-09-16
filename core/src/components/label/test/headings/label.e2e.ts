import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('label: rendering', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should inherit text overflow for headings', async ({ page }) => {
    await page.goto(`/src/components/label/test/headings`);

    expect(await page.screenshot()).toMatchSnapshot(`item-headings-inherit-${page.getSnapshotSettings()}.png`);
  });
});

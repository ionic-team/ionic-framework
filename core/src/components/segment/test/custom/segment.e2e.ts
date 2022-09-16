import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('segment: custom', () => {
  test('should not have visual regressions', async ({ page, skip }) => {
    skip.rtl();

    await page.goto('/src/components/segment/test/custom');

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`segment-custom-${page.getSnapshotSettings()}.png`);
  });
});

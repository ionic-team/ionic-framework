import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('radio: standalone', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/radio/test/standalone`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`radio-standalone-${page.getSnapshotSettings()}.png`);
  });
});

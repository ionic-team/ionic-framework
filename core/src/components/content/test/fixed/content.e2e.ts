import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('content: fixed', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/content/test/fixed`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`content-fixed-${page.getSnapshotSettings()}.png`);
  });
});

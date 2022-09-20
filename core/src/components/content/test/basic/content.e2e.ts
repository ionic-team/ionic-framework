import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('content: basic', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/content/test/basic`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`content-diff-${page.getSnapshotSettings()}.png`);
  });
});

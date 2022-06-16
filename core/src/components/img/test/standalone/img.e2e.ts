import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('img: standalone', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/img/test/standalone');

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`img-standalone-${page.getSnapshotSettings()}.png`);
  });
});

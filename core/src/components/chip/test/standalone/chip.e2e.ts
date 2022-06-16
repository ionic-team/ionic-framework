import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('chip: standalone', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/chip/test/standalone');

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`chip-standalone-${page.getSnapshotSettings()}.png`);
  });
});

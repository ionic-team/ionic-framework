import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('chip: rendering', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/chip/test/basic');

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`chip-basic-${page.getSnapshotSettings()}.png`);
  });
});

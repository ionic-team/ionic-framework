import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('accordion: nested', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/accordion/test/nested`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`accordion-nested-${page.getSnapshotSettings()}.png`);
  });
});

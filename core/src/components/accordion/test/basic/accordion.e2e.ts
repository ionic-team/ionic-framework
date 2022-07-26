import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('accordion: basic', () => {
  // TODO(FW-1842) Re-enable when flakiness has been addressed.
  test.skip('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/accordion/test/basic`);

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`accordion-basic-${page.getSnapshotSettings()}.png`);
  });
});

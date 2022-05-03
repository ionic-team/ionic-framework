import { expect } from '@playwright/test';
import { test, Viewports } from '@utils/test/playwright';

test.describe('modal: custom rendering', () => {
  test('should not have visual regressions', async ({ page }) => {
    await page.goto('/src/components/modal/test/custom');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    await page.click('#custom-modal');

    await ionModalDidPresent.next();

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`modal-custom-present-${page.getSnapshotSettings()}.png`);
  });

  test('should not have visual regressions with tablet viewport', async ({ page }) => {
    await page.setViewportSize(Viewports.tablet.portrait);
    await page.goto('/src/components/modal/test/custom');
    const ionModalDidPresent = await page.spyOnEvent('ionModalDidPresent');

    await page.click('#custom-modal');

    await ionModalDidPresent.next();

    await page.setIonViewport();

    expect(await page.screenshot()).toMatchSnapshot(`modal-custom-present-tablet-${page.getSnapshotSettings()}.png`);
  });
});

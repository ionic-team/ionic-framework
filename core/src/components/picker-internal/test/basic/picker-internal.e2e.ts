import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';


test.describe('picker-internal', () => {

  test('inline pickers should not have visual regression', async ({ page }) => {
    await page.goto(`/src/components/picker-internal/test/basic`);

    await page.setIonViewport();

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`picker-internal-inline-diff-${page.getSnapshotSettings()}.png`)
  });

  test('popover picker should not have visual regression', async ({ page }) => {
    await page.goto(`/src/components/picker-internal/test/basic`);

    await page.setIonViewport();

    await page.click('#popover');

    await page.locator('ion-popover').waitFor({ state: 'visible' });

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`picker-internal-popover-diff-${page.getSnapshotSettings()}.png`)
  });

  test('modal picker should not have visual regression', async ({ page }) => {
    await page.goto(`/src/components/picker-internal/test/basic`);

    await page.setIonViewport();

    await page.click('#modal');

    await page.locator('ion-modal').waitFor({ state: 'visible' });

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`picker-internal-popover-diff-${page.getSnapshotSettings()}.png`)
  });

});

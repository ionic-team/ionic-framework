import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('toggle: states', () => {
  test('should render disabled toggle correctly', async ({ page, skip }) => {
    skip.rtl();

    await page.setContent(`
      <ion-toggle disabled="true">Label</ion-toggle>
    `);

    const toggle = page.locator('ion-toggle');
    expect(await toggle.screenshot()).toMatchSnapshot(`toggle-disabled-${page.getSnapshotSettings()}.png`);
  });

  test('should render checked toggle correctly', async ({ page }) => {
    await page.setContent(`
      <ion-toggle checked="true">Label</ion-toggle>
    `);

    const toggle = page.locator('ion-toggle');
    expect(await toggle.screenshot()).toMatchSnapshot(`toggle-checked-${page.getSnapshotSettings()}.png`);
  });

  test('should render unchecked toggle correctly', async ({ page }) => {
    await page.setContent(`
      <ion-toggle>Label</ion-toggle>
    `);

    const toggle = page.locator('ion-toggle');
    expect(await toggle.screenshot()).toMatchSnapshot(`toggle-unchecked-${page.getSnapshotSettings()}.png`);
  });
});

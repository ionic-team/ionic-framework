import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('toggle: color', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });
  test('should apply color when checked', async ({ page }) => {
    await page.setContent(`
      <ion-toggle color="danger" checked="true">Label</ion-toggle>
    `);

    const toggle = page.locator('ion-toggle');
    expect(await toggle.screenshot()).toMatchSnapshot(`toggle-color-checked-${page.getSnapshotSettings()}.png`);
  });

  test('should not apply color when unchecked', async ({ page }) => {
    await page.setContent(`
      <ion-toggle color="danger">Label</ion-toggle>
    `);

    const toggle = page.locator('ion-toggle');
    expect(await toggle.screenshot()).toMatchSnapshot(`toggle-color-unchecked-${page.getSnapshotSettings()}.png`);
  });
});

import { expect } from '@playwright/test';
import { test } from '@utils/test/playwright';

test.describe('checkbox: color', () => {
  test.beforeEach(({ skip }) => {
    skip.rtl();
  });

  test('should apply color when checked', async ({ page }) => {
    await page.setContent(`
      <ion-checkbox color="danger" checked="true">Label</ion-checkbox>
    `);

    const checkbox = page.locator('ion-checkbox');
    expect(await checkbox.screenshot()).toMatchSnapshot(`checkbox-color-checked-${page.getSnapshotSettings()}.png`);
  });

  test('should not apply color when unchecked', async ({ page }) => {
    await page.setContent(`
      <ion-checkbox color="danger">Label</ion-checkbox>
    `);

    const checkbox = page.locator('ion-checkbox');
    expect(await checkbox.screenshot()).toMatchSnapshot(`checkbox-color-unchecked-${page.getSnapshotSettings()}.png`);
  });
});
